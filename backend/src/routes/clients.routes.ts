import { Router, Response } from 'express';
import pool from '../config/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query = `
      SELECT c.*, COUNT(i.id) as intervention_count
      FROM clients c
      LEFT JOIN interventions i ON c.id = i.client_id
    `;
    const params: any[] = [];

    if (search) {
      query += ` WHERE c.first_name ILIKE $1 OR c.last_name ILIKE $1 OR c.email ILIKE $1 OR c.phone ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` GROUP BY c.id ORDER BY c.last_name, c.first_name`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const clientResult = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

    if (clientResult.rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const interventionsResult = await pool.query(
      `SELECT i.*, u.first_name as plumber_first_name, u.last_name as plumber_last_name
       FROM interventions i
       LEFT JOIN users u ON i.assigned_to = u.id
       WHERE i.client_id = $1
       ORDER BY i.intervention_date DESC`,
      [id]
    );

    res.json({
      ...clientResult.rows[0],
      interventions: interventionsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, email, phone, address, city, postal_code, notes } = req.body;

    if (!first_name || !last_name || !phone || !address) {
      res.status(400).json({ error: 'Required fields: first_name, last_name, phone, address' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO clients (first_name, last_name, email, phone, address, city, postal_code, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [first_name, last_name, email, phone, address, city, postal_code, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, address, city, postal_code, notes } = req.body;

    const result = await pool.query(
      `UPDATE clients
       SET first_name = $1, last_name = $2, email = $3, phone = $4,
           address = $5, city = $6, postal_code = $7, notes = $8
       WHERE id = $9
       RETURNING *`,
      [first_name, last_name, email, phone, address, city, postal_code, notes, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
