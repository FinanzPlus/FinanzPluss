-- Ajout de commentaires de démonstration pour les produits
-- FinanzPlus Austria

-- Insertion de commentaires pour les meubles
INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    5,
    'Excellent produit! Tres bonne qualite et livraison rapide.',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'canape-cuir-moderne'
LIMIT 1;

INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    4,
    'Tres satisfait de mon achat. Le meuble correspond parfaitement a la description.',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'table-manger-bois'
LIMIT 1;

INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    5,
    'Qualite exceptionnelle! Je recommande vivement ce produit.',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'lit-king-size'
LIMIT 1;

INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    4,
    'Bon rapport qualite-prix. Montage facile et resultat impeccable.',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'armoire-penderie'
LIMIT 1;

INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    5,
    'Parfait pour le teletravail! Tres confortable et fonctionnel.',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'bureau-ergonomique'
LIMIT 1;

INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    5,
    'Design magnifique et tres solide. Exactement ce que je cherchais!',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'bibliotheque-design'
LIMIT 1;

INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    4,
    'Tres confortable, la fonction massage est un vrai plus!',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'fauteuil-relax'
LIMIT 1;

INSERT INTO comments (product_id, user_id, rating, comment, is_approved) 
SELECT 
    p.id,
    u.id,
    5,
    'Magnifique piece vintage! Restauration impeccable.',
    true
FROM products p
CROSS JOIN users u
WHERE p.slug = 'commode-vintage'
LIMIT 1;

-- Affichage du résumé
SELECT 'Commentaires ajoutes avec succes!' as message;
SELECT COUNT(*) as total_commentaires FROM comments;
SELECT p.title, COUNT(c.id) as nb_commentaires, AVG(c.rating) as note_moyenne
FROM products p
LEFT JOIN comments c ON c.product_id = p.id
WHERE p.category = 'furniture'
GROUP BY p.id, p.title
ORDER BY p.title;

-- Made with Bob
