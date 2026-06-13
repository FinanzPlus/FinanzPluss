-- Script pour ajouter des données de démonstration à FinanzPlus Austria
-- Exécuter après avoir initialisé la base de données

-- Insertion de produits de voitures
INSERT INTO products (title, description, price, category, status, slug) VALUES
('BMW Serie 3 2020', 'BMW Serie 3 en excellent état, faible kilométrage, entretien complet', 28500.00, 'car', 'active', 'bmw-serie-3-2020'),
('Mercedes-Benz C-Class 2019', 'Mercedes C-Class avec équipement premium, cuir, navigation', 32000.00, 'car', 'active', 'mercedes-benz-c-class-2019'),
('Audi A4 2021', 'Audi A4 comme neuve, garantie constructeur, toutes options', 35500.00, 'car', 'active', 'audi-a4-2021'),
('Volkswagen Golf 8 2022', 'VW Golf 8 dernière génération, économique et fiable', 24900.00, 'car', 'active', 'volkswagen-golf-8-2022'),
('Porsche 911 2018', 'Porsche 911 Carrera, performance exceptionnelle, état impeccable', 89000.00, 'car', 'active', 'porsche-911-2018');

-- Insertion des détails des voitures
INSERT INTO cars (product_id, brand, model, year, mileage, fuel_type, transmission, color, doors, seats, power)
SELECT 
    p.id,
    CASE 
        WHEN p.title LIKE '%BMW%' THEN 'BMW'
        WHEN p.title LIKE '%Mercedes%' THEN 'Mercedes-Benz'
        WHEN p.title LIKE '%Audi%' THEN 'Audi'
        WHEN p.title LIKE '%Volkswagen%' THEN 'Volkswagen'
        WHEN p.title LIKE '%Porsche%' THEN 'Porsche'
    END,
    CASE 
        WHEN p.title LIKE '%Serie 3%' THEN 'Serie 3'
        WHEN p.title LIKE '%C-Class%' THEN 'C-Class'
        WHEN p.title LIKE '%A4%' THEN 'A4'
        WHEN p.title LIKE '%Golf%' THEN 'Golf 8'
        WHEN p.title LIKE '%911%' THEN '911 Carrera'
    END,
    CASE 
        WHEN p.title LIKE '%2020%' THEN 2020
        WHEN p.title LIKE '%2019%' THEN 2019
        WHEN p.title LIKE '%2021%' THEN 2021
        WHEN p.title LIKE '%2022%' THEN 2022
        WHEN p.title LIKE '%2018%' THEN 2018
    END,
    CASE 
        WHEN p.title LIKE '%BMW%' THEN 45000
        WHEN p.title LIKE '%Mercedes%' THEN 52000
        WHEN p.title LIKE '%Audi%' THEN 28000
        WHEN p.title LIKE '%Volkswagen%' THEN 15000
        WHEN p.title LIKE '%Porsche%' THEN 38000
    END,
    CASE 
        WHEN p.title LIKE '%BMW%' THEN 'Diesel'
        WHEN p.title LIKE '%Mercedes%' THEN 'Benzin'
        WHEN p.title LIKE '%Audi%' THEN 'Hybrid'
        WHEN p.title LIKE '%Volkswagen%' THEN 'Benzin'
        WHEN p.title LIKE '%Porsche%' THEN 'Benzin'
    END,
    CASE 
        WHEN p.title LIKE '%Porsche%' THEN 'Manuell'
        ELSE 'Automatik'
    END,
    CASE 
        WHEN p.title LIKE '%BMW%' THEN 'Schwarz'
        WHEN p.title LIKE '%Mercedes%' THEN 'Silber'
        WHEN p.title LIKE '%Audi%' THEN 'Weiß'
        WHEN p.title LIKE '%Volkswagen%' THEN 'Blau'
        WHEN p.title LIKE '%Porsche%' THEN 'Rot'
    END,
    CASE 
        WHEN p.title LIKE '%911%' THEN 2
        ELSE 4
    END,
    5,
    CASE 
        WHEN p.title LIKE '%BMW%' THEN 190
        WHEN p.title LIKE '%Mercedes%' THEN 204
        WHEN p.title LIKE '%Audi%' THEN 245
        WHEN p.title LIKE '%Volkswagen%' THEN 150
        WHEN p.title LIKE '%Porsche%' THEN 385
    END
FROM products p
WHERE p.category = 'car';

-- Insertion de produits de meubles
INSERT INTO products (title, description, price, category, status, slug) VALUES
('Canapé en Cuir Moderne', 'Canapé 3 places en cuir véritable, design contemporain, très confortable', 1299.00, 'furniture', 'active', 'canape-cuir-moderne'),
('Table à Manger en Bois Massif', 'Table extensible en chêne massif, 6-8 personnes, finition naturelle', 899.00, 'furniture', 'active', 'table-manger-bois-massif'),
('Lit King Size avec Rangement', 'Lit king size avec tiroirs de rangement intégrés, tête de lit capitonnée', 1499.00, 'furniture', 'active', 'lit-king-size-rangement'),
('Armoire Penderie 3 Portes', 'Grande armoire en bois avec miroir, 3 portes coulissantes, nombreux rangements', 799.00, 'furniture', 'active', 'armoire-penderie-3-portes'),
('Bureau d\'Angle Ergonomique', 'Bureau d\'angle moderne avec étagères, idéal télétravail, finition chêne', 549.00, 'furniture', 'active', 'bureau-angle-ergonomique'),
('Bibliothèque Murale Design', 'Bibliothèque modulable 5 étagères, design scandinave, bois et métal', 399.00, 'furniture', 'active', 'bibliotheque-murale-design'),
('Fauteuil Relax Électrique', 'Fauteuil relax avec fonction massage, revêtement microfibre, très confortable', 899.00, 'furniture', 'active', 'fauteuil-relax-electrique'),
('Commode 6 Tiroirs Vintage', 'Commode vintage restaurée, 6 grands tiroirs, bois massif, style rétro', 649.00, 'furniture', 'active', 'commode-6-tiroirs-vintage');

-- Insertion des détails des meubles
INSERT INTO furniture (product_id, furniture_type, material, dimensions, color, style, weight)
SELECT 
    p.id,
    CASE 
        WHEN p.title LIKE '%Canapé%' THEN 'Canapé'
        WHEN p.title LIKE '%Table%' THEN 'Table'
        WHEN p.title LIKE '%Lit%' THEN 'Lit'
        WHEN p.title LIKE '%Armoire%' THEN 'Armoire'
        WHEN p.title LIKE '%Bureau%' THEN 'Bureau'
        WHEN p.title LIKE '%Bibliothèque%' THEN 'Bibliothèque'
        WHEN p.title LIKE '%Fauteuil%' THEN 'Fauteuil'
        WHEN p.title LIKE '%Commode%' THEN 'Commode'
    END,
    CASE 
        WHEN p.title LIKE '%Cuir%' THEN 'Cuir'
        WHEN p.title LIKE '%Bois%' THEN 'Bois massif'
        WHEN p.title LIKE '%Vintage%' THEN 'Bois massif'
        WHEN p.title LIKE '%Design%' THEN 'Bois et métal'
        ELSE 'Bois'
    END,
    CASE 
        WHEN p.title LIKE '%Canapé%' THEN '220x90x85 cm'
        WHEN p.title LIKE '%Table%' THEN '180x90x75 cm'
        WHEN p.title LIKE '%Lit%' THEN '200x180x120 cm'
        WHEN p.title LIKE '%Armoire%' THEN '220x180x60 cm'
        WHEN p.title LIKE '%Bureau%' THEN '140x140x75 cm'
        WHEN p.title LIKE '%Bibliothèque%' THEN '180x80x30 cm'
        WHEN p.title LIKE '%Fauteuil%' THEN '95x85x105 cm'
        WHEN p.title LIKE '%Commode%' THEN '120x80x45 cm'
    END,
    CASE 
        WHEN p.title LIKE '%Moderne%' THEN 'Noir'
        WHEN p.title LIKE '%Massif%' THEN 'Chêne naturel'
        WHEN p.title LIKE '%Rangement%' THEN 'Gris'
        WHEN p.title LIKE '%Armoire%' THEN 'Blanc'
        WHEN p.title LIKE '%Bureau%' THEN 'Chêne clair'
        WHEN p.title LIKE '%Design%' THEN 'Blanc et bois'
        WHEN p.title LIKE '%Relax%' THEN 'Marron'
        WHEN p.title LIKE '%Vintage%' THEN 'Bois naturel'
    END,
    CASE 
        WHEN p.title LIKE '%Moderne%' THEN 'Moderne'
        WHEN p.title LIKE '%Design%' THEN 'Scandinave'
        WHEN p.title LIKE '%Vintage%' THEN 'Vintage'
        ELSE 'Contemporain'
    END,
    CASE 
        WHEN p.title LIKE '%Canapé%' THEN 85.5
        WHEN p.title LIKE '%Table%' THEN 45.0
        WHEN p.title LIKE '%Lit%' THEN 120.0
        WHEN p.title LIKE '%Armoire%' THEN 150.0
        WHEN p.title LIKE '%Bureau%' THEN 35.0
        WHEN p.title LIKE '%Bibliothèque%' THEN 28.0
        WHEN p.title LIKE '%Fauteuil%' THEN 42.0
        WHEN p.title LIKE '%Commode%' THEN 55.0
    END
FROM products p
WHERE p.category = 'furniture';

-- Insertion d'images pour les produits (URLs de démonstration)
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT 
    p.id,
    'https://via.placeholder.com/800x600/333/fff?text=' || REPLACE(p.title, ' ', '+'),
    true,
    1
FROM products p;

-- Insertion d'offres financières
INSERT INTO financial_offers (title, description, interest_rate, min_amount, max_amount, min_duration, max_duration, offer_type, is_active) VALUES
('Crédit Auto Standard', 'Financement automobile avec taux préférentiel pour tous types de véhicules', 3.5, 5000, 50000, 12, 84, 'credit', true),
('Leasing Voiture Premium', 'Leasing flexible pour véhicules haut de gamme avec option d''achat', 2.9, 15000, 100000, 24, 60, 'leasing', true),
('Crédit Mobilier', 'Financement pour l''achat de meubles et équipements de maison', 4.2, 1000, 20000, 12, 48, 'credit', true),
('Prêt Personnel Rapide', 'Prêt personnel à taux fixe, réponse en 24h', 5.5, 2000, 30000, 12, 72, 'financing', true);

-- Insertion d'horaires d'ouverture
INSERT INTO opening_hours (day_of_week, open_time, close_time, is_closed) VALUES
(1, '09:00', '18:00', false), -- Lundi
(2, '09:00', '18:00', false), -- Mardi
(3, '09:00', '18:00', false), -- Mercredi
(4, '09:00', '18:00', false), -- Jeudi
(5, '09:00', '18:00', false), -- Vendredi
(6, '10:00', '16:00', false), -- Samedi
(0, NULL, NULL, true);         -- Dimanche (fermé)

-- Affichage du résumé
SELECT 'Données insérées avec succès!' as message;
SELECT COUNT(*) as total_produits FROM products;
SELECT COUNT(*) as total_voitures FROM cars;
SELECT COUNT(*) as total_meubles FROM furniture;
SELECT COUNT(*) as total_images FROM product_images;
SELECT COUNT(*) as total_offres_financieres FROM financial_offers;

-- Made with Bob
