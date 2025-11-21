import { Router, Response } from 'express';
import pool from '../config/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, client_id, start_date, end_date, urgent } = req.query;
    let query = `
      SELECT i.*,
             c.first_name as client_first_name,
             c.last_name as client_last_name,
             c.phone as client_phone,
             c.address as client_address,
             u.first_name as plumber_first_name,
             u.last_name as plumber_last_name
      FROM interventions i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN users u ON i.assigned_to = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND i.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (client_id) {
      query += ` AND i.client_id = $${paramCount}`;
      params.push(client_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND i.intervention_date >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND i.intervention_date <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    if (urgent === 'true') {
      query += ` AND i.is_urgent = true`;
    }

    query += ` ORDER BY i.intervention_date DESC, i.intervention_time DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const interventionResult = await pool.query(
      `SELECT i.*,
              c.first_name as client_first_name,
              c.last_name as client_last_name,
              c.email as client_email,
              c.phone as client_phone,
              c.address as client_address,
              c.city as client_city,
              c.postal_code as client_postal_code,
              u.first_name as plumber_first_name,
              u.last_name as plumber_last_name
       FROM interventions i
       JOIN clients c ON i.client_id = c.id
       LEFT JOIN users u ON i.assigned_to = u.id
       WHERE i.id = $1`,
      [id]
    );

    if (interventionResult.rows.length === 0) {
      res.status(404).json({ error: 'Intervention not found' });
      return;
    }

    const materialsResult = await pool.query(
      `SELECT im.*, inv.name, inv.reference, inv.unit_price as item_unit_price
       FROM intervention_materials im
       JOIN inventory inv ON im.inventory_id = inv.id
       WHERE im.intervention_id = $1`,
      [id]
    );

    res.json({
      ...interventionResult.rows[0],
      materials: materialsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching intervention:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      client_id,
      assigned_to,
      intervention_date,
      intervention_time,
      type,
      status,
      problem_description,
      work_done,
      time_spent,
      labor_cost,
      is_urgent,
      notes,
      materials,
    } = req.body;

    if (!client_id || !intervention_date || !type || !problem_description) {
      res.status(400).json({
        error: 'Required fields: client_id, intervention_date, type, problem_description',
      });
      return;
    }

    let materials_cost = 0;
    if (materials && materials.length > 0) {
      materials_cost = materials.reduce(
        (sum: number, m: any) => sum + (m.quantity * m.unit_price || 0),
        0
      );
    }

    const total_cost = (labor_cost || 0) + materials_cost;

    const interventionResult = await client.query(
      `INSERT INTO interventions
       (client_id, assigned_to, intervention_date, intervention_time, type, status,
        problem_description, work_done, time_spent, labor_cost, materials_cost, total_cost,
        is_urgent, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        client_id,
        assigned_to,
        intervention_date,
        intervention_time,
        type,
        status || 'planned',
        problem_description,
        work_done,
        time_spent,
        labor_cost,
        materials_cost,
        total_cost,
        is_urgent || false,
        notes,
      ]
    );

    const intervention = interventionResult.rows[0];

    if (materials && materials.length > 0) {
      for (const material of materials) {
        await client.query(
          `INSERT INTO intervention_materials (intervention_id, inventory_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [intervention.id, material.inventory_id, material.quantity, material.unit_price]
        );

        await client.query(
          `UPDATE inventory SET quantity = quantity - $1 WHERE id = $2`,
          [material.quantity, material.inventory_id]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(intervention);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating intervention:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      client_id,
      assigned_to,
      intervention_date,
      intervention_time,
      type,
      status,
      problem_description,
      work_done,
      time_spent,
      labor_cost,
      is_urgent,
      notes,
      materials,
    } = req.body;

    const oldMaterialsResult = await client.query(
      'SELECT inventory_id, quantity FROM intervention_materials WHERE intervention_id = $1',
      [id]
    );

    for (const oldMaterial of oldMaterialsResult.rows) {
      await client.query(
        'UPDATE inventory SET quantity = quantity + $1 WHERE id = $2',
        [oldMaterial.quantity, oldMaterial.inventory_id]
      );
    }

    await client.query('DELETE FROM intervention_materials WHERE intervention_id = $1', [id]);

    let materials_cost = 0;
    if (materials && materials.length > 0) {
      materials_cost = materials.reduce(
        (sum: number, m: any) => sum + (m.quantity * m.unit_price || 0),
        0
      );

      for (const material of materials) {
        await client.query(
          `INSERT INTO intervention_materials (intervention_id, inventory_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [id, material.inventory_id, material.quantity, material.unit_price]
        );

        await client.query(
          'UPDATE inventory SET quantity = quantity - $1 WHERE id = $2',
          [material.quantity, material.inventory_id]
        );
      }
    }

    const total_cost = (labor_cost || 0) + materials_cost;

    const result = await client.query(
      `UPDATE interventions
       SET client_id = $1, assigned_to = $2, intervention_date = $3, intervention_time = $4,
           type = $5, status = $6, problem_description = $7, work_done = $8,
           time_spent = $9, labor_cost = $10, materials_cost = $11, total_cost = $12,
           is_urgent = $13, notes = $14
       WHERE id = $15
       RETURNING *`,
      [
        client_id,
        assigned_to,
        intervention_date,
        intervention_time,
        type,
        status,
        problem_description,
        work_done,
        time_spent,
        labor_cost,
        materials_cost,
        total_cost,
        is_urgent,
        notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Intervention not found' });
      return;
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating intervention:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;

    const materialsResult = await client.query(
      'SELECT inventory_id, quantity FROM intervention_materials WHERE intervention_id = $1',
      [id]
    );

    for (const material of materialsResult.rows) {
      await client.query(
        'UPDATE inventory SET quantity = quantity + $1 WHERE id = $2',
        [material.quantity, material.inventory_id]
      );
    }

    const result = await client.query('DELETE FROM interventions WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Intervention not found' });
      return;
    }

    await client.query('COMMIT');
    res.json({ message: 'Intervention deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting intervention:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
