import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const Impressum = () => {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <h1 className="legal-title">Impressum</h1>
          <p className="legal-subtitle">Angaben gemäß § 5 TMG und § 25 MedienG</p>
        </div>
      </div>

      <div className="legal-content">
        <div className="container">
          <div className="legal-section">
            <h2>Diensteanbieter</h2>
            <div className="info-box">
              <p><strong>FinanzPlus Austria GmbH</strong></p>
              <p>Stephansplatz 1</p>
              <p>1010 Wien</p>
              <p>Österreich</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Kontaktdaten</h2>
            <div className="info-box">
              <p><strong>Telefon:</strong> <a href="tel:+49 155 65236794">+49 155 65236794</a></p>
              <p><strong>E-Mail:</strong> <a href="mailto:Kontakt_finanzplusaustria@proton.me">Kontakt_finanzplusaustria@proton.me</a></p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Vertretungsberechtigte Geschäftsführer</h2>
            <div className="info-box">
              <p>Max Mustermann (Geschäftsführer)</p>
              <p>Maria Musterfrau (Geschäftsführerin)</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Registereintrag</h2>
            <div className="info-box">
              <p><strong>Firmenbuchnummer:</strong> FN 123456a</p>
              <p><strong>Firmenbuchgericht:</strong> Handelsgericht Wien</p>
              <p><strong>UID-Nummer:</strong> ATU12345678</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Aufsichtsbehörde</h2>
            <div className="info-box">
              <p><strong>Finanzmarktaufsicht (FMA)</strong></p>
              <p>Otto-Wagner-Platz 5</p>
              <p>1090 Wien</p>
              <p>Österreich</p>
              <p><strong>Website:</strong> <a href="https://www.fma.gv.at" target="_blank" rel="noopener noreferrer">www.fma.gv.at</a></p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <div className="info-box">
              <p><strong>Berufsbezeichnung:</strong> Kreditvermittler</p>
              <p><strong>Zuständige Kammer:</strong> Wirtschaftskammer Österreich</p>
              <p><strong>Verliehen in:</strong> Österreich</p>
              <p><strong>Berufsrechtliche Regelungen:</strong></p>
              <ul>
                <li>Gewerbeordnung (GewO)</li>
                <li>Maklergesetz (MaklerG)</li>
                <li>Verbraucherkreditgesetz (VKrG)</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>Berufshaftpflichtversicherung</h2>
            <div className="info-box">
              <p><strong>Versicherer:</strong> Wiener Städtische Versicherung AG</p>
              <p><strong>Geltungsbereich:</strong> Österreich</p>
              <p><strong>Deckungssumme:</strong> 2.000.000 EUR</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Streitschlichtung</h2>
            <div className="info-box">
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
              <p><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a></p>
              <p className="mt-3">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
              <p className="mt-3">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Haftung für Inhalte</h2>
            <div className="info-box">
              <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
              <p className="mt-3">Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Haftung für Links</h2>
            <div className="info-box">
              <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
              <p className="mt-3">Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Urheberrecht</h2>
            <div className="info-box">
              <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
              <p className="mt-3">Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
            </div>
          </div>

          <div className="legal-section">
            <h2>Bildnachweise</h2>
            <div className="info-box">
              <p>Die auf dieser Website verwendeten Bilder stammen aus folgenden Quellen:</p>
              <ul>
                <li>Eigene Fotografien</li>
                <li>Lizenzierte Stock-Fotos (Unsplash, Pexels)</li>
                <li>Partnerlogos mit Genehmigung der jeweiligen Banken</li>
              </ul>
            </div>
          </div>

          <div className="legal-navigation">
            <h3>Weitere rechtliche Informationen</h3>
            <div className="legal-links-grid">
              <Link to="/datenschutz" className="legal-link-card">
                <span className="legal-link-icon">🔒</span>
                <span className="legal-link-title">Datenschutz</span>
                <span className="legal-link-desc">Informationen zur Datenverarbeitung</span>
              </Link>
              <Link to="/agb" className="legal-link-card">
                <span className="legal-link-icon">📄</span>
                <span className="legal-link-title">AGB</span>
                <span className="legal-link-desc">Allgemeine Geschäftsbedingungen</span>
              </Link>
              <Link to="/cookies" className="legal-link-card">
                <span className="legal-link-icon">🍪</span>
                <span className="legal-link-title">Cookie-Richtlinie</span>
                <span className="legal-link-desc">Verwendung von Cookies</span>
              </Link>
            </div>
          </div>

          <div className="legal-footer-note">
            <p><strong>Hinweis:</strong> Diese Seite wurde zuletzt aktualisiert am 12. Juni 2026.</p>
            <p>Bei Fragen zum Impressum kontaktieren Sie uns bitte unter <a href="mailto:Kontakt_finanzplusaustria@proton.me">Kontakt_finanzplusaustria@proton.me</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impressum;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
