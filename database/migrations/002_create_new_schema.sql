-- FinanzPlus Austria - Migration 002
-- Création du nouveau schéma financier
-- Date: 2026-06-12

BEGIN;

-- Enable UUID extension si pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. MODIFICATION DE LA TABLE USERS (Ajout champs financiers)
-- ============================================================================

-- Ajouter les nouveaux champs à la table users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS monthly_income DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS monthly_expenses DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS credit_score INTEGER;

-- Créer un index sur le téléphone
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- ============================================================================
-- 2. TABLE PARTNERS (Partenaires Bancaires)
-- ============================================================================

CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    official_website VARCHAR(500),
    
    -- Conditions de prêt
    interest_rate_min DECIMAL(5, 2) NOT NULL,
    interest_rate_max DECIMAL(5, 2) NOT NULL,
    min_loan_amount DECIMAL(10, 2) NOT NULL,
    max_loan_amount DECIMAL(10, 2) NOT NULL,
    min_duration_months INTEGER NOT NULL,
    max_duration_months INTEGER NOT NULL,
    
    -- Certifications et accréditations
    certifications JSONB DEFAULT '[]'::jsonb,
    
    -- Gestion
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partners_active ON partners(is_active);
CREATE INDEX idx_partners_display_order ON partners(display_order);

-- ============================================================================
-- 3. TABLE LOAN_REQUESTS (Demandes de Prêt - Enrichie)
-- ============================================================================

-- Supprimer l'ancienne table si elle existe
DROP TABLE IF EXISTS loan_requests CASCADE;

CREATE TABLE loan_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
    
    -- Informations personnelles
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Détails du prêt
    amount DECIMAL(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL DEFAULT 3.00,
    monthly_payment DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    total_interest DECIMAL(10, 2) NOT NULL,
    
    -- Objet du prêt
    purpose VARCHAR(100) NOT NULL CHECK (purpose IN ('immobilier', 'personnel', 'professionnel', 'vehicule', 'education', 'autre')),
    purpose_details TEXT,
    
    -- Informations financières
    monthly_income DECIMAL(10, 2),
    monthly_expenses DECIMAL(10, 2),
    employment_status VARCHAR(50),
    
    -- Statut et suivi
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'completed', 'cancelled')),
    admin_notes TEXT,
    rejection_reason TEXT,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    
    -- Métadonnées
    ip_address VARCHAR(45),
    user_agent TEXT,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_requests_user_id ON loan_requests(user_id);
CREATE INDEX idx_loan_requests_status ON loan_requests(status);
CREATE INDEX idx_loan_requests_created_at ON loan_requests(created_at);
CREATE INDEX idx_loan_requests_partner_id ON loan_requests(partner_id);

-- ============================================================================
-- 4. TABLE DOCUMENTS (Documents Utilisateur)
-- ============================================================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    loan_request_id UUID REFERENCES loan_requests(id) ON DELETE CASCADE,
    
    -- Type de document
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'identity_card', 'passport', 'proof_of_income', 
        'bank_statement', 'tax_return', 'employment_contract', 
        'proof_of_residence', 'other'
    )),
    
    -- Informations du fichier
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Vérification
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_loan_request_id ON documents(loan_request_id);
CREATE INDEX idx_documents_status ON documents(status);

-- ============================================================================
-- 5. TABLE CREDIT_SCORES (Scores de Crédit)
-- ============================================================================

CREATE TABLE credit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Score global
    score INTEGER CHECK (score >= 300 AND score <= 850),
    score_category VARCHAR(20) CHECK (score_category IN ('poor', 'fair', 'good', 'very_good', 'excellent')),
    
    -- Facteurs détaillés
    payment_history_score INTEGER CHECK (payment_history_score >= 0 AND payment_history_score <= 100),
    credit_utilization_score INTEGER CHECK (credit_utilization_score >= 0 AND credit_utilization_score <= 100),
    credit_history_length_score INTEGER CHECK (credit_history_length_score >= 0 AND credit_history_length_score <= 100),
    credit_mix_score INTEGER CHECK (credit_mix_score >= 0 AND credit_mix_score <= 100),
    
    -- Calcul
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_update_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_credit_scores_user_id ON credit_scores(user_id);
CREATE INDEX idx_credit_scores_score ON credit_scores(score);

-- ============================================================================
-- 6. TABLE LOAN_COMPARISONS (Comparaisons de Prêts)
-- ============================================================================

CREATE TABLE loan_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Paramètres de comparaison
    amount DECIMAL(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL,
    
    -- Résultats (JSON avec détails de chaque banque)
    comparison_data JSONB NOT NULL,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_comparisons_user_id ON loan_comparisons(user_id);
CREATE INDEX idx_loan_comparisons_created_at ON loan_comparisons(created_at);

-- ============================================================================
-- 7. TABLE FAQS (Questions Fréquentes)
-- ============================================================================

CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Catégorie
    category VARCHAR(100) NOT NULL,
    
    -- Contenu en allemand
    question_de TEXT NOT NULL,
    answer_de TEXT NOT NULL,
    
    -- Gestion
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_active ON faqs(is_active);
CREATE INDEX idx_faqs_display_order ON faqs(display_order);

-- ============================================================================
-- 8. TABLE NOTIFICATIONS (Notifications Utilisateur)
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Type de notification
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'loan_status_change', 'document_verified', 'document_rejected',
        'new_message', 'reminder', 'promotion', 'system'
    )),
    
    -- Contenu
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- État
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Action
    action_url VARCHAR(500),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- 9. TABLE LEGAL_DOCUMENTS (Documents Légaux)
-- ============================================================================

CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Type de document
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'privacy_policy', 'terms_conditions', 'cookie_policy', 'impressum'
    )),
    
    -- Contenu en allemand
    title_de VARCHAR(255) NOT NULL,
    content_de TEXT NOT NULL,
    
    -- Version
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(document_type, version)
);

CREATE INDEX idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX idx_legal_documents_active ON legal_documents(is_active);

-- ============================================================================
-- 10. TABLE USER_CONSENTS (Consentements DSGVO)
-- ============================================================================

CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Type de consentement
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN (
        'privacy_policy', 'terms_conditions', 'marketing_emails', 
        'data_processing', 'cookies', 'analytics'
    )),
    
    -- Consentement
    consented BOOLEAN NOT NULL,
    consent_date TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    
    -- Révocation
    withdrawn_at TIMESTAMP,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX idx_user_consents_type ON user_consents(consent_type);

-- ============================================================================
-- 11. MODIFICATION DE LA TABLE COMMENTS (Avis Généraux)
-- ============================================================================

-- Supprimer la contrainte de clé étrangère vers products si elle existe
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_product_id_fkey;

-- Rendre product_id nullable et ajouter un champ pour les avis généraux
ALTER TABLE comments 
ALTER COLUMN product_id DROP NOT NULL,
ADD COLUMN IF NOT EXISTS is_general_review BOOLEAN DEFAULT TRUE;

-- Mettre à jour les commentaires existants
UPDATE comments SET is_general_review = TRUE WHERE product_id IS NULL;

-- Créer un index
CREATE INDEX IF NOT EXISTS idx_comments_general ON comments(is_general_review);

-- ============================================================================
-- TRIGGERS POUR LES TIMESTAMPS
-- ============================================================================

-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer les triggers
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loan_requests_updated_at BEFORE UPDATE ON loan_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_scores_updated_at BEFORE UPDATE ON credit_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON legal_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MESSAGE DE CONFIRMATION
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration 002 terminée avec succès!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Nouvelles tables créées: 10';
    RAISE NOTICE '- partners';
    RAISE NOTICE '- loan_requests (enrichie)';
    RAISE NOTICE '- documents';
    RAISE NOTICE '- credit_scores';
    RAISE NOTICE '- loan_comparisons';
    RAISE NOTICE '- faqs';
    RAISE NOTICE '- notifications';
    RAISE NOTICE '- legal_documents';
    RAISE NOTICE '- user_consents';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables modifiées: 2';
    RAISE NOTICE '- users (champs financiers ajoutés)';
    RAISE NOTICE '- comments (avis généraux)';
    RAISE NOTICE '';
    RAISE NOTICE 'Prochaine étape: Exécuter 003_seed_initial_data.sql';
    RAISE NOTICE '========================================';
END $$;

COMMIT;

-- Made with Bob
