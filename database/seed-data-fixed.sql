-- Script corrigé pour ajouter des données de démonstration
-- FinanzPlus Austria

-- Insertion de produits de voitures
INSERT INTO products (title, description, price, category, status, slug) VALUES
('BMW Serie 3 2020', 'BMW Serie 3 en excellent etat, faible kilometrage', 28500.00, 'car', 'active', 'bmw-serie-3-2020'),
('Mercedes-Benz C-Class 2019', 'Mercedes C-Class avec equipement premium', 32000.00, 'car', 'active', 'mercedes-c-class-2019'),
('Audi A4 2021', 'Audi A4 comme neuve, garantie constructeur', 35500.00, 'car', 'active', 'audi-a4-2021'),
('Volkswagen Golf 8 2022', 'VW Golf 8 derniere generation', 24900.00, 'car', 'active', 'vw-golf-8-2022'),
('Porsche 911 2018', 'Porsche 911 Carrera, performance exceptionnelle', 89000.00, 'car', 'active', 'porsche-911-2018');

-- Insertion des détails des voitures
INSERT INTO cars (product_id, brand, model, year, mileage, fuel_type, transmission, color, doors, seats, power_hp)
SELECT 
    p.id,
    CASE 
        WHEN p.slug = 'bmw-serie-3-2020' THEN 'BMW'
        WHEN p.slug = 'mercedes-c-class-2019' THEN 'Mercedes-Benz'
        WHEN p.slug = 'audi-a4-2021' THEN 'Audi'
        WHEN p.slug = 'vw-golf-8-2022' THEN 'Volkswagen'
        WHEN p.slug = 'porsche-911-2018' THEN 'Porsche'
    END,
    CASE 
        WHEN p.slug = 'bmw-serie-3-2020' THEN 'Serie 3'
        WHEN p.slug = 'mercedes-c-class-2019' THEN 'C-Class'
        WHEN p.slug = 'audi-a4-2021' THEN 'A4'
        WHEN p.slug = 'vw-golf-8-2022' THEN 'Golf 8'
        WHEN p.slug = 'porsche-911-2018' THEN '911 Carrera'
    END,
    CASE 
        WHEN p.slug = 'bmw-serie-3-2020' THEN 2020
        WHEN p.slug = 'mercedes-c-class-2019' THEN 2019
        WHEN p.slug = 'audi-a4-2021' THEN 2021
        WHEN p.slug = 'vw-golf-8-2022' THEN 2022
        WHEN p.slug = 'porsche-911-2018' THEN 2018
    END,
    CASE 
        WHEN p.slug = 'bmw-serie-3-2020' THEN 45000
        WHEN p.slug = 'mercedes-c-class-2019' THEN 52000
        WHEN p.slug = 'audi-a4-2021' THEN 28000
        WHEN p.slug = 'vw-golf-8-2022' THEN 15000
        WHEN p.slug = 'porsche-911-2018' THEN 38000
    END,
    CASE 
        WHEN p.slug = 'bmw-serie-3-2020' THEN 'Diesel'
        WHEN p.slug = 'mercedes-c-class-2019' THEN 'Benzin'
        WHEN p.slug = 'audi-a4-2021' THEN 'Hybrid'
        WHEN p.slug = 'vw-golf-8-2022' THEN 'Benzin'
        WHEN p.slug = 'porsche-911-2018' THEN 'Benzin'
    END,
    CASE 
        WHEN p.slug = 'porsche-911-2018' THEN 'Manuell'
        ELSE 'Automatik'
    END,
    CASE 
        WHEN p.slug = 'bmw-serie-3-2020' THEN 'Schwarz'
        WHEN p.slug = 'mercedes-c-class-2019' THEN 'Silber'
        WHEN p.slug = 'audi-a4-2021' THEN 'Weiss'
        WHEN p.slug = 'vw-golf-8-2022' THEN 'Blau'
        WHEN p.slug = 'porsche-911-2018' THEN 'Rot'
    END,
    CASE 
        WHEN p.slug = 'porsche-911-2018' THEN 2
        ELSE 4
    END,
    5,
    CASE 
        WHEN p.slug = 'bmw-serie-3-2020' THEN 190
        WHEN p.slug = 'mercedes-c-class-2019' THEN 204
        WHEN p.slug = 'audi-a4-2021' THEN 245
        WHEN p.slug = 'vw-golf-8-2022' THEN 150
        WHEN p.slug = 'porsche-911-2018' THEN 385
    END
FROM products p
WHERE p.category = 'car';

-- Insertion de produits de meubles
INSERT INTO products (title, description, price, category, status, slug) VALUES
('Canape en Cuir Moderne', 'Canape 3 places en cuir veritable, design contemporain', 1299.00, 'furniture', 'active', 'canape-cuir-moderne'),
('Table a Manger en Bois', 'Table extensible en chene massif, 6-8 personnes', 899.00, 'furniture', 'active', 'table-manger-bois'),
('Lit King Size', 'Lit king size avec tiroirs de rangement integres', 1499.00, 'furniture', 'active', 'lit-king-size'),
('Armoire Penderie', 'Grande armoire en bois avec miroir, 3 portes', 799.00, 'furniture', 'active', 'armoire-penderie'),
('Bureau Ergonomique', 'Bureau moderne avec etageres, ideal teletravail', 549.00, 'furniture', 'active', 'bureau-ergonomique'),
('Bibliotheque Design', 'Bibliotheque modulable 5 etageres, style scandinave', 399.00, 'furniture', 'active', 'bibliotheque-design'),
('Fauteuil Relax', 'Fauteuil relax avec fonction massage', 899.00, 'furniture', 'active', 'fauteuil-relax'),
('Commode Vintage', 'Commode vintage restauree, 6 grands tiroirs', 649.00, 'furniture', 'active', 'commode-vintage');

-- Insertion des détails des meubles
INSERT INTO furniture (product_id, furniture_type, material, color, dimensions_length, dimensions_width, dimensions_height, weight, style)
SELECT 
    p.id,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 'Canape'
        WHEN p.slug = 'table-manger-bois' THEN 'Table'
        WHEN p.slug = 'lit-king-size' THEN 'Lit'
        WHEN p.slug = 'armoire-penderie' THEN 'Armoire'
        WHEN p.slug = 'bureau-ergonomique' THEN 'Bureau'
        WHEN p.slug = 'bibliotheque-design' THEN 'Bibliotheque'
        WHEN p.slug = 'fauteuil-relax' THEN 'Fauteuil'
        WHEN p.slug = 'commode-vintage' THEN 'Commode'
    END,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 'Cuir'
        WHEN p.slug = 'commode-vintage' THEN 'Bois massif'
        WHEN p.slug = 'bibliotheque-design' THEN 'Bois et metal'
        ELSE 'Bois'
    END,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 'Noir'
        WHEN p.slug = 'table-manger-bois' THEN 'Chene naturel'
        WHEN p.slug = 'lit-king-size' THEN 'Gris'
        WHEN p.slug = 'armoire-penderie' THEN 'Blanc'
        WHEN p.slug = 'bureau-ergonomique' THEN 'Chene clair'
        WHEN p.slug = 'bibliotheque-design' THEN 'Blanc et bois'
        WHEN p.slug = 'fauteuil-relax' THEN 'Marron'
        WHEN p.slug = 'commode-vintage' THEN 'Bois naturel'
    END,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 220
        WHEN p.slug = 'table-manger-bois' THEN 180
        WHEN p.slug = 'lit-king-size' THEN 200
        WHEN p.slug = 'armoire-penderie' THEN 220
        WHEN p.slug = 'bureau-ergonomique' THEN 140
        WHEN p.slug = 'bibliotheque-design' THEN 180
        WHEN p.slug = 'fauteuil-relax' THEN 95
        WHEN p.slug = 'commode-vintage' THEN 120
    END,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 90
        WHEN p.slug = 'table-manger-bois' THEN 90
        WHEN p.slug = 'lit-king-size' THEN 180
        WHEN p.slug = 'armoire-penderie' THEN 180
        WHEN p.slug = 'bureau-ergonomique' THEN 140
        WHEN p.slug = 'bibliotheque-design' THEN 80
        WHEN p.slug = 'fauteuil-relax' THEN 85
        WHEN p.slug = 'commode-vintage' THEN 80
    END,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 85
        WHEN p.slug = 'table-manger-bois' THEN 75
        WHEN p.slug = 'lit-king-size' THEN 120
        WHEN p.slug = 'armoire-penderie' THEN 60
        WHEN p.slug = 'bureau-ergonomique' THEN 75
        WHEN p.slug = 'bibliotheque-design' THEN 30
        WHEN p.slug = 'fauteuil-relax' THEN 105
        WHEN p.slug = 'commode-vintage' THEN 45
    END,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 85.5
        WHEN p.slug = 'table-manger-bois' THEN 45.0
        WHEN p.slug = 'lit-king-size' THEN 120.0
        WHEN p.slug = 'armoire-penderie' THEN 150.0
        WHEN p.slug = 'bureau-ergonomique' THEN 35.0
        WHEN p.slug = 'bibliotheque-design' THEN 28.0
        WHEN p.slug = 'fauteuil-relax' THEN 42.0
        WHEN p.slug = 'commode-vintage' THEN 55.0
    END,
    CASE 
        WHEN p.slug = 'canape-cuir-moderne' THEN 'Moderne'
        WHEN p.slug = 'bibliotheque-design' THEN 'Scandinave'
        WHEN p.slug = 'commode-vintage' THEN 'Vintage'
        ELSE 'Contemporain'
    END
FROM products p
WHERE p.category = 'furniture';

-- Insertion d'images pour les produits
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT 
    p.id,
    'https://via.placeholder.com/800x600/333/fff?text=' || REPLACE(p.title, ' ', '+'),
    true,
    1
FROM products p;

-- Insertion d'offres financières
INSERT INTO financial_offers (title, description, interest_rate, min_amount, max_amount, min_duration_months, max_duration_months, offer_type, is_active) VALUES
('Credit Auto Standard', 'Financement automobile avec taux preferentiel', 3.5, 5000, 50000, 12, 84, 'credit', true),
('Leasing Voiture Premium', 'Leasing flexible pour vehicules haut de gamme', 2.9, 15000, 100000, 24, 60, 'leasing', true),
('Credit Mobilier', 'Financement pour achat de meubles', 4.2, 1000, 20000, 12, 48, 'credit', true),
('Pret Personnel Rapide', 'Pret personnel a taux fixe, reponse en 24h', 5.5, 2000, 30000, 12, 72, 'financing', true);

-- Insertion d'horaires d'ouverture
INSERT INTO opening_hours (day_of_week, open_time, close_time, is_closed) VALUES
(1, '09:00', '18:00', false),
(2, '09:00', '18:00', false),
(3, '09:00', '18:00', false),
(4, '09:00', '18:00', false),
(5, '09:00', '18:00', false),
(6, '10:00', '16:00', false),
(0, NULL, NULL, true);

-- Affichage du résumé
SELECT 'Donnees inserees avec succes!' as message;
SELECT COUNT(*) as total_produits FROM products;
SELECT COUNT(*) as total_voitures FROM cars;
SELECT COUNT(*) as total_meubles FROM furniture;
SELECT COUNT(*) as total_images FROM product_images;
SELECT COUNT(*) as total_offres FROM financial_offers;

-- Made with Bob
