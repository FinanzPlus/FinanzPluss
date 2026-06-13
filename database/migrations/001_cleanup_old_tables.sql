-- FinanzPlus Austria - Migration 001
-- Nettoyage des tables e-commerce obsolètes
-- Date: 2026-06-12
-- ATTENTION: Cette migration supprime définitivement les données produits

-- Commencer une transaction
BEGIN;

-- Sauvegarder les utilisateurs existants (au cas où)
CREATE TABLE IF NOT EXISTS users_backup_20260612 AS 
SELECT * FROM users;

-- Sauvegarder les commentaires existants (si liés aux produits)
CREATE TABLE IF NOT EXISTS comments_backup_20260612 AS 
SELECT * FROM comments;

-- Sauvegarder les horaires d'ouverture
CREATE TABLE IF NOT EXISTS opening_hours_backup_20260612 AS 
SELECT * FROM opening_hours;

-- Sauvegarder les messages de contact
CREATE TABLE IF NOT EXISTS contact_messages_backup_20260612 AS 
SELECT * FROM contact_messages;

-- Supprimer les tables e-commerce dans le bon ordre (contraintes)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS furniture CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS financial_offers CASCADE;

-- Supprimer les index associés s'ils existent encore
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_products_slug;
DROP INDEX IF EXISTS idx_cars_brand;
DROP INDEX IF EXISTS idx_cars_year;
DROP INDEX IF EXISTS idx_furniture_type;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_orders_status;

-- Nettoyer les logs d'activité liés aux produits
DELETE FROM activity_logs 
WHERE entity_type IN ('product', 'car', 'furniture', 'order', 'cart');

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration 001 terminée avec succès';
    RAISE NOTICE 'Tables e-commerce supprimées: 11';
    RAISE NOTICE 'Backups créés: 4 tables';
    RAISE NOTICE 'Prochaine étape: Exécuter 002_create_new_schema.sql';
END $$;

COMMIT;

-- Vérification post-migration
SELECT 
    'Tables restantes' as info,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Made with Bob
