-- FinanzPlus Austria Database Schema
-- PostgreSQL Database - 100% Financial Services Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'Österreich',
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'advisor')),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank Partners Table
CREATE TABLE bank_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    website_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    base_interest_rate DECIMAL(5, 2) NOT NULL DEFAULT 2.50,
    min_loan_amount DECIMAL(10, 2) DEFAULT 1000,
    max_loan_amount DECIMAL(10, 2) DEFAULT 500000,
    min_duration_months INTEGER DEFAULT 12,
    max_duration_months INTEGER DEFAULT 360,
    specialties TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Requests Table
CREATE TABLE loan_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_partner_id UUID REFERENCES bank_partners(id) ON DELETE SET NULL,
    loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('personal', 'mortgage', 'car', 'business', 'renovation', 'education')),
    amount DECIMAL(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL,
    monthly_payment DECIMAL(10, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    total_interest DECIMAL(10, 2) NOT NULL,
    purpose TEXT,
    employment_status VARCHAR(50),
    monthly_income DECIMAL(10, 2),
    existing_loans BOOLEAN DEFAULT FALSE,
    existing_loans_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'completed', 'cancelled')),
    admin_notes TEXT,
    rejection_reason TEXT,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Simulations Table (for saved simulations)
CREATE TABLE loan_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_partner_id UUID REFERENCES bank_partners(id) ON DELETE SET NULL,
    loan_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    monthly_payment DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    simulation_data JSONB,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments/Reviews Table (for platform reviews)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_partner_id UUID REFERENCES bank_partners(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    loan_type VARCHAR(50),
    loan_amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_verified BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comment Likes Table
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, comment_id)
);

-- Opening Hours Table
CREATE TABLE opening_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    opening_time TIME,
    closing_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    special_note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(day_of_week)
);

-- Contact Messages Table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50) CHECK (inquiry_type IN ('general', 'loan_inquiry', 'complaint', 'partnership', 'other')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'replied', 'archived')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    appointment_type VARCHAR(50) NOT NULL CHECK (appointment_type IN ('consultation', 'loan_review', 'document_review', 'follow_up')),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(255),
    is_online BOOLEAN DEFAULT FALSE,
    meeting_link VARCHAR(500),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table (for loan application documents)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    loan_request_id UUID REFERENCES loan_requests(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('id_card', 'income_proof', 'bank_statement', 'tax_return', 'employment_contract', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    interests TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    unsubscribe_reason TEXT
);

-- FAQ Table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs Table (for admin dashboard and audit)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('loan_status', 'appointment', 'document', 'message', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit Score Records Table
CREATE TABLE credit_score_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 300 AND score <= 850),
    provider VARCHAR(100),
    report_date DATE NOT NULL,
    factors JSONB,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bank_partners_slug ON bank_partners(slug);
CREATE INDEX idx_bank_partners_active ON bank_partners(is_active);
CREATE INDEX idx_loan_requests_user_id ON loan_requests(user_id);
CREATE INDEX idx_loan_requests_status ON loan_requests(status);
CREATE INDEX idx_loan_requests_bank_partner ON loan_requests(bank_partner_id);
CREATE INDEX idx_loan_simulations_user_id ON loan_simulations(user_id);
CREATE INDEX idx_comments_bank_partner_id ON comments(bank_partner_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_loan_request ON documents(loan_request_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_partners_updated_at BEFORE UPDATE ON bank_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loan_requests_updated_at BEFORE UPDATE ON loan_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opening_hours_updated_at BEFORE UPDATE ON opening_hours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default opening hours
INSERT INTO opening_hours (day_of_week, opening_time, closing_time, is_closed) VALUES
(0, NULL, NULL, TRUE), -- Sunday - Closed
(1, '09:00', '18:00', FALSE), -- Monday
(2, '09:00', '18:00', FALSE), -- Tuesday
(3, '09:00', '18:00', FALSE), -- Wednesday
(4, '09:00', '18:00', FALSE), -- Thursday
(5, '09:00', '17:00', FALSE), -- Friday
(6, NULL, NULL, TRUE); -- Saturday - Closed

-- Insert default Austrian bank partners
INSERT INTO bank_partners (name, slug, description, base_interest_rate, min_loan_amount, max_loan_amount, specialties, is_featured, display_order) VALUES
('Erste Bank', 'erste-bank', 'Österreichs größte Bank mit über 200 Jahren Erfahrung in der Finanzierung', 2.50, 5000, 500000, ARRAY['Immobilienfinanzierung', 'Wohnbaukredit', 'Umschuldung'], TRUE, 1),
('Raiffeisen Bank', 'raiffeisen-bank', 'Führende Genossenschaftsbank mit individuellen Finanzlösungen', 2.80, 3000, 400000, ARRAY['Unternehmenskredite', 'Landwirtschaft', 'KMU-Finanzierung'], TRUE, 2),
('Bank Austria', 'bank-austria', 'Teil der UniCredit Gruppe mit internationaler Expertise', 2.65, 5000, 600000, ARRAY['Privatkredit', 'Autokredit', 'Renovierungskredit'], TRUE, 3),
('BAWAG P.S.K.', 'bawag-psk', 'Österreichische Universalbank mit günstigen Konditionen', 2.45, 2000, 300000, ARRAY['Schnellkredit', 'Konsumkredit', 'Umschuldung'], TRUE, 4),
('Volksbank', 'volksbank', 'Regionale Bank mit persönlicher Beratung', 2.90, 3000, 250000, ARRAY['Regionalförderung', 'Kleinkredit', 'Privatkredit'], TRUE, 5);

-- Made with Bob - FinanzPlus Austria 100% Financial Platform
