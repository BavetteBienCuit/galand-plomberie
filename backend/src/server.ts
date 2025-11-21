import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import clientsRoutes from './routes/clients.routes';
import interventionsRoutes from './routes/interventions.routes';
import inventoryRoutes from './routes/inventory.routes';
import statisticsRoutes from './routes/statistics.routes';
import pdfRoutes from './routes/pdf.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'GALAND Plomberie API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clients: '/api/clients',
      interventions: '/api/interventions',
      inventory: '/api/inventory',
      statistics: '/api/statistics',
      pdf: '/api/pdf',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/interventions', interventionsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/pdf', pdfRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   GALAND Plomberie API Server          ║
║   Running on port ${PORT}                 ║
║   Environment: ${process.env.NODE_ENV || 'development'}            ║
╚════════════════════════════════════════╝
  `);
});

export default app;
