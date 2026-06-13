-- FinanzPlus Austria - Migration 003
-- Données initiales (seed data)
-- Date: 2026-06-12

BEGIN;

-- ============================================================================
-- 1. PARTENAIRES BANCAIRES AUTRICHIENS
-- ============================================================================

INSERT INTO partners (name, logo_url, description, official_website, interest_rate_min, interest_rate_max, min_loan_amount, max_loan_amount, min_duration_months, max_duration_months, certifications, is_active, display_order) VALUES

('Erste Bank', '/assets/logos/partners/erste-bank.png', 
'Die Erste Bank ist eine der größten Banken Österreichs und bietet maßgeschneiderte Kreditlösungen für Privatkunden.', 
'https://www.erstebank.at', 
2.5, 4.5, 5000, 75000, 12, 84, 
'["FMA-Lizenz", "EU Banking License", "ISO 27001"]'::jsonb, 
true, 1),

('Raiffeisen Bank', '/assets/logos/partners/raiffeisen.png', 
'Raiffeisen ist Österreichs führende Bankengruppe mit über 130 Jahren Erfahrung im Kreditgeschäft.', 
'https://www.raiffeisen.at', 
2.8, 4.8, 3000, 100000, 12, 96, 
'["FMA-Lizenz", "EU Banking License", "Austrian Banking Association"]'::jsonb, 
true, 2),

('Bank Austria', '/assets/logos/partners/bank-austria.png', 
'Bank Austria, Teil der UniCredit Gruppe, bietet flexible Finanzierungslösungen für alle Lebenssituationen.', 
'https://www.bankaustria.at', 
2.9, 5.0, 5000, 80000, 12, 84, 
'["FMA-Lizenz", "EU Banking License", "UniCredit Group"]'::jsonb, 
true, 3),

('BAWAG P.S.K.', '/assets/logos/partners/bawag.png', 
'BAWAG P.S.K. ist eine der größten Banken Österreichs mit attraktiven Kreditkonditionen.', 
'https://www.bawagpsk.com', 
2.7, 4.6, 4000, 70000, 12, 72, 
'["FMA-Lizenz", "EU Banking License", "Austrian Banking"]'::jsonb, 
true, 4),

('Volksbank', '/assets/logos/partners/volksbank.png', 
'Die Volksbanken sind regional verwurzelt und bieten persönliche Beratung für Ihre Finanzierung.', 
'https://www.volksbank.at', 
3.0, 5.2, 3000, 60000, 12, 84, 
'["FMA-Lizenz", "EU Banking License", "Regional Banking"]'::jsonb, 
true, 5),

('Santander Consumer Bank', '/assets/logos/partners/santander.png', 
'Santander Consumer Bank ist spezialisiert auf Konsumentenkredite mit schneller Abwicklung.', 
'https://www.santanderconsumer.at', 
2.9, 4.9, 5000, 50000, 12, 72, 
'["FMA-Lizenz", "EU Banking License", "Santander Group"]'::jsonb, 
true, 6);

-- ============================================================================
-- 2. FAQs (Questions Fréquentes en Allemand)
-- ============================================================================

INSERT INTO faqs (category, question_de, answer_de, display_order, is_active) VALUES

-- Catégorie: Allgemeine Fragen
('Allgemeine Fragen', 
'Wie lange dauert die Kreditgenehmigung?', 
'In der Regel erhalten Sie innerhalb von 24-48 Stunden eine Rückmeldung zu Ihrem Kreditantrag. Bei vollständigen Unterlagen kann die Genehmigung noch schneller erfolgen.', 
1, true),

('Allgemeine Fragen', 
'Welche Unterlagen benötige ich für einen Kreditantrag?', 
'Für einen Kreditantrag benötigen Sie: Gültigen Lichtbildausweis (Reisepass oder Personalausweis), Einkommensnachweise der letzten 3 Monate, Kontoauszüge, und ggf. Arbeitsvertrag.', 
2, true),

('Allgemeine Fragen', 
'Kann ich mehrere Kredite gleichzeitig beantragen?', 
'Ja, Sie können mehrere Kreditanträge stellen. Wir empfehlen jedoch, zunächst einen Antrag zu stellen und auf die Rückmeldung zu warten.', 
3, true),

-- Catégorie: Kreditbedingungen
('Kreditbedingungen', 
'Wie hoch ist der Zinssatz?', 
'Unser Standardzinssatz beträgt 3% p.a. (fest). Je nach Bonität und Kreditbetrag können individuelle Konditionen vereinbart werden.', 
1, true),

('Kreditbedingungen', 
'Welche Kreditbeträge sind möglich?', 
'Sie können Kredite zwischen 3.000€ und 100.000€ beantragen, abhängig von Ihrer Bonität und dem gewählten Partnerinstitut.', 
2, true),

('Kreditbedingungen', 
'Welche Laufzeiten sind verfügbar?', 
'Die Kreditlaufzeit kann zwischen 12 und 96 Monaten gewählt werden, je nach Kreditbetrag und Partnerbank.', 
3, true),

('Kreditbedingungen', 
'Gibt es versteckte Gebühren?', 
'Nein, wir arbeiten mit vollständiger Transparenz. Alle Kosten werden im Kreditrechner angezeigt. Es gibt keine versteckten Gebühren.', 
4, true),

-- Catégorie: Antragsprozess
('Antragsprozess', 
'Wie funktioniert der Antragsprozess?', 
'1. Nutzen Sie unseren Kreditrechner, 2. Füllen Sie das Online-Formular aus, 3. Laden Sie die erforderlichen Dokumente hoch, 4. Wir prüfen Ihren Antrag, 5. Sie erhalten eine Rückmeldung innerhalb von 24-48 Stunden.', 
1, true),

('Antragsprozess', 
'Muss ich zur Bank gehen?', 
'Nein, der gesamte Prozess kann online abgewickelt werden. Sie müssen nicht persönlich zur Bank gehen.', 
2, true),

('Antragsprozess', 
'Was passiert nach der Genehmigung?', 
'Nach der Genehmigung erhalten Sie den Kreditvertrag per E-Mail. Nach Unterzeichnung wird der Betrag innerhalb von 2-3 Werktagen auf Ihr Konto überwiesen.', 
3, true),

-- Catégorie: Rückzahlung
('Rückzahlung', 
'Kann ich den Kredit vorzeitig zurückzahlen?', 
'Ja, eine vorzeitige Rückzahlung ist jederzeit möglich. Es fallen keine Vorfälligkeitsentschädigungen an.', 
1, true),

('Rückzahlung', 
'Was passiert bei Zahlungsschwierigkeiten?', 
'Kontaktieren Sie uns umgehend. Wir finden gemeinsam eine Lösung, wie z.B. eine Ratenpause oder Umschuldung.', 
2, true),

('Rückzahlung', 
'Kann ich die Ratenhöhe ändern?', 
'Nach Vertragsabschluss ist die Ratenhöhe festgelegt. Bei finanziellen Änderungen können wir jedoch über Anpassungen sprechen.', 
3, true),

-- Catégorie: Sicherheit
('Sicherheit', 
'Sind meine Daten sicher?', 
'Ja, wir verwenden modernste Verschlüsselungstechnologien (SSL/TLS) und sind DSGVO-konform. Ihre Daten werden niemals an Dritte weitergegeben.', 
1, true),

('Sicherheit', 
'Wie werden meine Dokumente gespeichert?', 
'Alle hochgeladenen Dokumente werden verschlüsselt auf sicheren Servern in Österreich gespeichert und nach Abschluss des Prozesses gelöscht.', 
2, true);

-- ============================================================================
-- 3. DOCUMENTS LÉGAUX (Versions initiales)
-- ============================================================================

INSERT INTO legal_documents (document_type, title_de, content_de, version, is_active, effective_date) VALUES

('privacy_policy', 
'Datenschutzerklärung', 
'# Datenschutzerklärung

## 1. Verantwortlicher
FinanzPlus Austria
[Adresse]
E-Mail: datenschutz@finanzplus.at

## 2. Erhebung und Speicherung personenbezogener Daten
Wir erheben und verarbeiten Ihre personenbezogenen Daten nur, soweit dies zur Erbringung unserer Dienstleistungen erforderlich ist.

## 3. Ihre Rechte
Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.

[Vollständiger Text folgt]', 
'1.0', true, CURRENT_DATE),

('terms_conditions', 
'Allgemeine Geschäftsbedingungen', 
'# Allgemeine Geschäftsbedingungen

## 1. Geltungsbereich
Diese AGB gelten für alle Verträge zwischen FinanzPlus Austria und Kunden.

## 2. Vertragsschluss
Der Vertrag kommt durch Annahme des Kreditangebots zustande.

[Vollständiger Text folgt]', 
'1.0', true, CURRENT_DATE),

('cookie_policy', 
'Cookie-Richtlinie', 
'# Cookie-Richtlinie

## Was sind Cookies?
Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden.

## Welche Cookies verwenden wir?
- Notwendige Cookies (für Funktionalität)
- Analytische Cookies (für Statistiken)

[Vollständiger Text folgt]', 
'1.0', true, CURRENT_DATE),

('impressum', 
'Impressum', 
'# Impressum

## Angaben gemäß § 5 TMG

FinanzPlus Austria
[Vollständige Adresse]
[Telefon]
[E-Mail]

Geschäftsführer: [Name]
Registergericht: [Gericht]
Registernummer: [Nummer]

[Vollständiger Text folgt]', 
'1.0', true, CURRENT_DATE);

-- ============================================================================
-- 4. HORAIRES D'OUVERTURE (Si pas déjà existants)
-- ============================================================================

INSERT INTO opening_hours (day_of_week, opening_time, closing_time, is_closed)
VALUES 
(1, '09:00', '18:00', false), -- Lundi
(2, '09:00', '18:00', false), -- Mardi
(3, '09:00', '18:00', false), -- Mercredi
(4, '09:00', '18:00', false), -- Jeudi
(5, '09:00', '17:00', false), -- Vendredi
(6, '10:00', '14:00', false), -- Samedi
(0, NULL, NULL, true)          -- Dimanche (fermé)
ON CONFLICT (day_of_week) DO NOTHING;

-- ============================================================================
-- MESSAGE DE CONFIRMATION
-- ============================================================================

DO $$
DECLARE
    partner_count INTEGER;
    faq_count INTEGER;
    legal_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO partner_count FROM partners;
    SELECT COUNT(*) INTO faq_count FROM faqs;
    SELECT COUNT(*) INTO legal_count FROM legal_documents;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration 003 terminée avec succès!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Données initiales insérées:';
    RAISE NOTICE '- % partenaires bancaires', partner_count;
    RAISE NOTICE '- % FAQs', faq_count;
    RAISE NOTICE '- % documents légaux', legal_count;
    RAISE NOTICE '- 7 horaires d''ouverture';
    RAISE NOTICE '';
    RAISE NOTICE 'Base de données prête pour utilisation!';
    RAISE NOTICE '========================================';
END $$;

COMMIT;

-- Made with Bob
