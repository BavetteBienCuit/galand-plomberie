import { Router, Response } from 'express';
import PDFDocument from 'pdfkit';
import pool from '../config/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

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

    const intervention = interventionResult.rows[0];

    const materialsResult = await pool.query(
      `SELECT im.*, inv.name, inv.reference
       FROM intervention_materials im
       JOIN inventory inv ON im.inventory_id = inv.id
       WHERE im.intervention_id = $1`,
      [id]
    );

    const materials = materialsResult.rows;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=rapport-intervention-${id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text('ENTREPRISE GALAND', { align: 'center' });
    doc.fontSize(14).text('Plomberie & Chauffage', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text('Tel: 01 23 45 67 89', { align: 'center' });
    doc.text('Email: contact@galand-plomberie.fr', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(16).text(`Rapport d'Intervention N°${intervention.id}`, { underline: true });
    doc.moveDown();

    doc.fontSize(12).text('Informations Client', { underline: true });
    doc.fontSize(10);
    doc.text(`Nom: ${intervention.client_first_name} ${intervention.client_last_name}`);
    doc.text(`Téléphone: ${intervention.client_phone}`);
    if (intervention.client_email) {
      doc.text(`Email: ${intervention.client_email}`);
    }
    doc.text(`Adresse: ${intervention.client_address}`);
    if (intervention.client_city && intervention.client_postal_code) {
      doc.text(`${intervention.client_postal_code} ${intervention.client_city}`);
    }
    doc.moveDown();

    doc.fontSize(12).text('Détails de l\'Intervention', { underline: true });
    doc.fontSize(10);
    doc.text(`Date: ${new Date(intervention.intervention_date).toLocaleDateString('fr-FR')}`);
    if (intervention.intervention_time) {
      doc.text(`Heure: ${intervention.intervention_time}`);
    }
    doc.text(`Type: ${intervention.type}`);
    doc.text(`Statut: ${intervention.status}`);
    if (intervention.is_urgent) {
      doc.fillColor('red').text('URGENT', { continued: false });
      doc.fillColor('black');
    }
    if (intervention.plumber_first_name) {
      doc.text(`Plombier: ${intervention.plumber_first_name} ${intervention.plumber_last_name}`);
    }
    doc.moveDown();

    doc.fontSize(12).text('Description du Problème', { underline: true });
    doc.fontSize(10).text(intervention.problem_description || 'N/A');
    doc.moveDown();

    if (intervention.work_done) {
      doc.fontSize(12).text('Travaux Effectués', { underline: true });
      doc.fontSize(10).text(intervention.work_done);
      doc.moveDown();
    }

    if (materials.length > 0) {
      doc.fontSize(12).text('Pièces Utilisées', { underline: true });
      doc.fontSize(10);

      const tableTop = doc.y;
      const itemCol = 50;
      const refCol = 200;
      const qtyCol = 320;
      const priceCol = 380;
      const totalCol = 460;

      doc.text('Article', itemCol, tableTop);
      doc.text('Réf.', refCol, tableTop);
      doc.text('Qté', qtyCol, tableTop);
      doc.text('P.U.', priceCol, tableTop);
      doc.text('Total', totalCol, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let yPos = tableTop + 20;
      materials.forEach((material: any) => {
        const total = material.quantity * (material.unit_price || 0);
        doc.text(material.name, itemCol, yPos, { width: 140 });
        doc.text(material.reference || '-', refCol, yPos);
        doc.text(material.quantity.toString(), qtyCol, yPos);
        doc.text((material.unit_price || 0).toFixed(2) + ' €', priceCol, yPos);
        doc.text(total.toFixed(2) + ' €', totalCol, yPos);
        yPos += 20;
      });

      doc.moveDown(materials.length + 1);
    }

    doc.fontSize(12).text('Récapitulatif Financier', { underline: true });
    doc.fontSize(10);
    if (intervention.time_spent) {
      doc.text(`Temps passé: ${intervention.time_spent} heures`);
    }
    if (intervention.labor_cost) {
      doc.text(`Main d'œuvre: ${parseFloat(intervention.labor_cost).toFixed(2)} €`);
    }
    if (intervention.materials_cost) {
      doc.text(`Fournitures: ${parseFloat(intervention.materials_cost).toFixed(2)} €`);
    }
    doc.moveDown();
    doc.fontSize(12).text(
      `TOTAL: ${parseFloat(intervention.total_cost || 0).toFixed(2)} € TTC`,
      { underline: true }
    );

    if (intervention.notes) {
      doc.moveDown(2);
      doc.fontSize(12).text('Notes', { underline: true });
      doc.fontSize(10).text(intervention.notes);
    }

    doc.moveDown(3);
    doc.fontSize(8).text(
      `Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
      { align: 'center' }
    );

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
