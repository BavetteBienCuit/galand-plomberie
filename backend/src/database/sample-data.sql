-- Données d'exemple pour GALAND Plomberie
-- Exécuter APRÈS avoir créé le schéma avec schema.sql

-- Clients d'exemple
INSERT INTO clients (first_name, last_name, email, phone, address, city, postal_code, notes) VALUES
('Jean', 'Dupont', 'jean.dupont@email.fr', '06 12 34 56 78', '15 Rue de la République', 'Paris', '75001', 'Client régulier, préfère les RDV le matin'),
('Marie', 'Martin', 'marie.martin@email.fr', '06 23 45 67 89', '8 Avenue des Champs', 'Lyon', '69002', NULL),
('Pierre', 'Bernard', 'p.bernard@email.fr', '06 34 56 78 90', '22 Boulevard Voltaire', 'Marseille', '13001', 'Attention : code d''entrée 1234'),
('Sophie', 'Dubois', 'sophie.dubois@email.fr', '06 45 67 89 01', '5 Place de la Mairie', 'Toulouse', '31000', NULL),
('Luc', 'Moreau', NULL, '06 56 78 90 12', '33 Rue du Commerce', 'Nice', '06000', 'Appeler avant de venir'),
('Claire', 'Laurent', 'c.laurent@email.fr', '06 67 89 01 23', '12 Allée des Roses', 'Nantes', '44000', NULL),
('Thomas', 'Simon', 'thomas.s@email.fr', '06 78 90 12 34', '7 Impasse des Lilas', 'Strasbourg', '67000', 'Client VIP'),
('Emma', 'Michel', 'emma.michel@email.fr', '06 89 01 23 45', '19 Route Nationale', 'Bordeaux', '33000', NULL);

-- Articles d'inventaire
INSERT INTO inventory (name, reference, description, quantity, min_quantity, unit_price, category) VALUES
('Robinet mitigeur cuisine', 'ROB-MIT-001', 'Robinet mitigeur chromé pour cuisine', 15, 5, 89.90, 'Robinetterie'),
('Robinet lavabo salle de bain', 'ROB-LAV-002', 'Robinet pour lavabo, finition chromée', 12, 5, 65.50, 'Robinetterie'),
('Tuyau PVC Ø32mm', 'TUY-PVC-032', 'Tuyau PVC blanc, diamètre 32mm, longueur 2m', 50, 20, 8.90, 'Tuyauterie'),
('Tuyau PVC Ø50mm', 'TUY-PVC-050', 'Tuyau PVC blanc, diamètre 50mm, longueur 2m', 35, 15, 12.50, 'Tuyauterie'),
('Siphon évier', 'SIP-EVI-001', 'Siphon pour évier de cuisine', 20, 10, 15.90, 'Évacuation'),
('Joint torique 20mm', 'JNT-TOR-020', 'Joint torique 20mm (lot de 10)', 8, 5, 5.90, 'Joints'),
('Joint torique 32mm', 'JNT-TOR-032', 'Joint torique 32mm (lot de 10)', 12, 5, 6.90, 'Joints'),
('Chasse d''eau complète', 'CHA-COM-001', 'Mécanisme de chasse d''eau complet', 10, 3, 45.00, 'WC'),
('Flexible douche 1.5m', 'FLX-DOU-150', 'Flexible de douche chromé 1,5m', 18, 8, 12.90, 'Douche'),
('Pommeau de douche', 'POM-DOU-001', 'Pommeau de douche 3 jets', 14, 6, 25.90, 'Douche'),
('Cartouche céramique 35mm', 'CAR-CER-035', 'Cartouche céramique pour mitigeur 35mm', 3, 5, 18.50, 'Pièces détachées'),
('Raccord laiton 15mm', 'RAC-LAI-015', 'Raccord en laiton 15mm (lot de 5)', 25, 10, 8.90, 'Raccords'),
('Téflon rouleau', 'TEF-ROU-001', 'Rouleau de téflon pour plomberie', 30, 15, 2.50, 'Consommables'),
('Filasse chanvre', 'FIL-CHA-001', 'Filasse de chanvre 100g', 20, 10, 4.90, 'Consommables'),
('Dégrippant WD-40', 'DEG-WD4-001', 'Spray dégrippant multifonction 400ml', 4, 5, 9.90, 'Consommables');

-- Interventions d'exemple
INSERT INTO interventions (client_id, intervention_date, intervention_time, type, status, problem_description, work_done, time_spent, labor_cost, materials_cost, total_cost, is_urgent, notes) VALUES
(1, CURRENT_DATE - INTERVAL '5 days', '09:00', 'Fuite', 'invoiced', 'Fuite sous l''évier de cuisine', 'Remplacement du siphon et des joints toriques. Test d''étanchéité effectué.', 1.5, 75.00, 21.80, 96.80, false, 'Client satisfait, paiement effectué'),
(2, CURRENT_DATE - INTERVAL '3 days', '14:30', 'Débouchage', 'completed', 'WC bouché', 'Débouchage manuel du WC. Pas besoin de remplacement.', 1.0, 60.00, 0.00, 60.00, true, 'Intervention urgente réussie'),
(3, CURRENT_DATE - INTERVAL '2 days', '10:00', 'Installation', 'completed', 'Installation d''un nouveau robinet de cuisine', 'Dépose ancien robinet et installation du nouveau mitigeur. Raccordement et test.', 2.0, 120.00, 89.90, 209.90, false, NULL),
(4, CURRENT_DATE - INTERVAL '1 day', '15:00', 'Réparation', 'in_progress', 'Fuite au niveau de la douche', 'Inspection en cours, remplacement du flexible prévu', 0.5, 40.00, 12.90, 52.90, false, 'RDV de finalisation prévu demain'),
(5, CURRENT_DATE, '09:30', 'Urgence', 'planned', 'Fuite importante chaudière', NULL, NULL, NULL, NULL, NULL, true, 'URGENT - Appeler avant d''arriver'),
(6, CURRENT_DATE + INTERVAL '1 day', '10:00', 'Entretien', 'planned', 'Entretien annuel chaudière', NULL, NULL, NULL, NULL, NULL, false, 'Entretien de routine'),
(7, CURRENT_DATE + INTERVAL '2 days', '14:00', 'Installation', 'planned', 'Installation nouveau WC', NULL, NULL, NULL, NULL, NULL, false, 'Client fournit le WC'),
(8, CURRENT_DATE + INTERVAL '3 days', '11:00', 'Réparation', 'planned', 'Robinet qui goutte', NULL, NULL, NULL, NULL, NULL, false, NULL);

-- Matériaux utilisés pour les interventions terminées
INSERT INTO intervention_materials (intervention_id, inventory_id, quantity, unit_price) VALUES
(1, 5, 1, 15.90),   -- Siphon évier
(1, 6, 1, 5.90),    -- Joint torique 20mm
(3, 1, 1, 89.90),   -- Robinet mitigeur cuisine
(4, 9, 1, 12.90);   -- Flexible douche

-- Note: Les quantités en stock ont été automatiquement mises à jour par les triggers
