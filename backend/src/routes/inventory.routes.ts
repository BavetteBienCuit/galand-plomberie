import { Router, Response } from 'express';
import pool from '../config/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, low_stock } = req.query;
    let query = 'SELECT * FROM inventory WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR reference ILIKE $${paramCount} OR category ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (low_stock === 'true') {
      query += ' AND quantity <= min_quantity';
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/low-stock', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM inventory WHERE quantity <= min_quantity ORDER BY quantity ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM inventory WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, reference, description, quantity, min_quantity, unit_price, category } = req.body;

    if (!name || quantity === undefined) {
      res.status(400).json({ error: 'Required fields: name, quantity' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO inventory (name, reference, description, quantity, min_quantity, unit_price, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, reference, description, quantity, min_quantity || 5, unit_price, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, reference, description, quantity, min_quantity, unit_price, category } = req.body;

    const result = await pool.query(
      `UPDATE inventory
       SET name = $1, reference = $2, description = $3, quantity = $4,
           min_quantity = $5, unit_price = $6, category = $7
       WHERE id = $8
       RETURNING *`,
      [name, reference, description, quantity, min_quantity, unit_price, category, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
