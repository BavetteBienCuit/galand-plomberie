import { Router, Response } from 'express';
import pool from '../config/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { Statistics } from '../types';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalInterventionsResult = await pool.query(
      'SELECT COUNT(*) as count FROM interventions'
    );

    const interventionsThisMonthResult = await pool.query(
      `SELECT COUNT(*) as count FROM interventions
       WHERE EXTRACT(MONTH FROM intervention_date) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM intervention_date) = EXTRACT(YEAR FROM CURRENT_DATE)`
    );

    const completedInterventionsResult = await pool.query(
      "SELECT COUNT(*) as count FROM interventions WHERE status = 'completed' OR status = 'invoiced'"
    );

    const pendingInterventionsResult = await pool.query(
      "SELECT COUNT(*) as count FROM interventions WHERE status = 'planned' OR status = 'in_progress'"
    );

    const urgentInterventionsResult = await pool.query(
      "SELECT COUNT(*) as count FROM interventions WHERE is_urgent = true AND status != 'completed' AND status != 'invoiced'"
    );

    const totalRevenueResult = await pool.query(
      "SELECT COALESCE(SUM(total_cost), 0) as sum FROM interventions WHERE status = 'invoiced'"
    );

    const revenueThisMonthResult = await pool.query(
      `SELECT COALESCE(SUM(total_cost), 0) as sum FROM interventions
       WHERE status = 'invoiced'
       AND EXTRACT(MONTH FROM intervention_date) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM intervention_date) = EXTRACT(YEAR FROM CURRENT_DATE)`
    );

    const activeClientsResult = await pool.query(
      `SELECT COUNT(DISTINCT client_id) as count FROM interventions
       WHERE intervention_date >= CURRENT_DATE - INTERVAL '6 months'`
    );

    const lowStockItemsResult = await pool.query(
      'SELECT COUNT(*) as count FROM inventory WHERE quantity <= min_quantity'
    );

    const statistics: Statistics = {
      total_interventions: parseInt(totalInterventionsResult.rows[0].count),
      interventions_this_month: parseInt(interventionsThisMonthResult.rows[0].count),
      completed_interventions: parseInt(completedInterventionsResult.rows[0].count),
      pending_interventions: parseInt(pendingInterventionsResult.rows[0].count),
      urgent_interventions: parseInt(urgentInterventionsResult.rows[0].count),
      total_revenue: parseFloat(totalRevenueResult.rows[0].sum),
      revenue_this_month: parseFloat(revenueThisMonthResult.rows[0].sum),
      active_clients: parseInt(activeClientsResult.rows[0].count),
      low_stock_items: parseInt(lowStockItemsResult.rows[0].count),
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/monthly-revenue', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT
         EXTRACT(MONTH FROM intervention_date) as month,
         EXTRACT(YEAR FROM intervention_date) as year,
         COALESCE(SUM(total_cost), 0) as revenue,
         COUNT(*) as intervention_count
       FROM interventions
       WHERE status = 'invoiced'
       AND intervention_date >= CURRENT_DATE - INTERVAL '12 months'
       GROUP BY EXTRACT(YEAR FROM intervention_date), EXTRACT(MONTH FROM intervention_date)
       ORDER BY year DESC, month DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/interventions-by-type', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT type, COUNT(*) as count
       FROM interventions
       GROUP BY type
       ORDER BY count DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching interventions by type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
