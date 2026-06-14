import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const AGB = () => {
  return (
    <div className="legal-page">
      {/* Hero Section */}
      <section className="legal-hero">
        <div className="container">
          <div className="legal-hero-content">
            <h1 className="legal-title">Allgemeine Geschäftsbedingungen</h1>
            <p className="legal-subtitle">
              Die rechtlichen Rahmenbedingungen für die Nutzung unserer Dienstleistungen
            </p>
            <div className="legal-meta">
              <span className="legal-meta-item">
                📅 Gültig ab: 1. Januar 2026
              </span>
              <span className="legal-meta-item">
                ⏱️ Lesezeit: 10 Minuten
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content">
        <div className="container">
          <div className="legal-grid">
            {/* Sidebar Navigation */}
            <aside className="legal-sidebar">
              <div className="legal-nav">
                <h3 className="legal-nav-title">Inhaltsverzeichnis</h3>
                <ul className="legal-nav-list">
                  <li><a href="#geltungsbereich">1. Geltungsbereich</a></li>
                  <li><a href="#vertragspartner">2. Vertragspartner</a></li>
                  <li><a href="#leistungen">3. Leistungen</a></li>
                  <li><a href="#vertragsschluss">4. Vertragsschluss</a></li>
                  <li><a href="#pflichten">5. Pflichten</a></li>
                  <li><a href="#verguetung">6. Vergütung</a></li>
                  <li><a href="#haftung">7. Haftung</a></li>
                  <li><a href="#datenschutz">8. Datenschutz</a></li>
                  <li><a href="#widerrufsrecht">9. Widerrufsrecht</a></li>
                  <li><a href="#kuendigung">10. Kündigung</a></li>
                  <li><a href="#streitbeilegung">11. Streitbeilegung</a></li>
                  <li><a href="#schlussbestimmungen">12. Schlussbestimmungen</a></li>
                </ul>
              </div>

              <div className="legal-contact-box">
                <h4>Fragen zu den AGB?</h4>
                <p>Unser Kundenservice hilft Ihnen gerne weiter.</p>
                <Link to="/kontakt" className="btn btn-secondary btn-sm">
                  💬 Kontakt aufnehmen
                </Link>
              </div>
            </aside>

            {/* Main Content */}
            <div className="legal-main">
              {/* Präambel */}
              <div className="legal-section">
                <div className="legal-highlight-box">
                  <h3>Präambel</h3>
                  <p>
                    Die nachfolgenden Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der 
                    Website und Dienstleistungen von FinanzPlus Austria GmbH. Durch die Nutzung unserer 
                    Dienste erklären Sie sich mit diesen Bedingungen einverstanden.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <div id="geltungsbereich" className="legal-section">
                <h2 className="legal-section-title">1. Geltungsbereich</h2>
                <div className="legal-text">
                  <h3>1.1 Anwendungsbereich</h3>
                  <p>
                    Diese AGB gelten für alle Geschäftsbeziehungen zwischen FinanzPlus Austria GmbH 
                    (nachfolgend "FinanzPlus" oder "wir") und den Nutzern unserer Website und 
                    Dienstleistungen (nachfolgend "Kunde" oder "Sie").
                  </p>

                  <h3>1.2 Abweichende Bedingungen</h3>
                  <p>
                    Abweichende, entgegenstehende oder ergänzende AGB des Kunden werden nur dann 
                    Vertragsbestandteil, wenn wir deren Geltung ausdrücklich schriftlich zugestimmt haben.
                  </p>

                  <h3>1.3 Verbraucher und Unternehmer</h3>
                  <p>
                    Diese AGB gelten sowohl für Verbraucher als auch für Unternehmer. Verbraucher im 
                    Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken 
                    abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen 
                    beruflichen Tätigkeit zugerechnet werden können.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="vertragspartner" className="legal-section">
                <h2 className="legal-section-title">2. Vertragspartner und Kontaktdaten</h2>
                <div className="legal-text">
                  <p>Der Vertrag kommt zustande mit:</p>
                  <div className="legal-info-box">
                    <strong>FinanzPlus Austria GmbH</strong><br />
                    Kärntner Ring 5-7<br />
                    1010 Wien, Österreich<br />
                    <br />
                    Firmenbuchnummer: FN 123456a<br />
                    UID-Nummer: ATU12345678<br />
                    Gewerbeberechtigung: Vermögensberatung<br />
                    <br />
                    Telefon: +49 155 65236794<br />
                    E-Mail: Kontakt_finanzplusaustria@proton.me
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div id="leistungen" className="legal-section">
                <h2 className="legal-section-title">3. Leistungen von FinanzPlus</h2>
                <div className="legal-text">
                  <h3>3.1 Kreditvermittlung</h3>
                  <p>
                    FinanzPlus vermittelt Kredite zwischen Kunden und Partnerbanken. Wir sind kein 
                    Kreditgeber, sondern ein unabhängiger Vermittler. Der Kreditvertrag kommt direkt 
                    zwischen Ihnen und der jeweiligen Bank zustande.
                  </p>

                  <h3>3.2 Kreditvergleich</h3>
                  <p>
                    Wir bieten einen kostenlosen Kreditvergleich an, der Ihnen hilft, das beste 
                    Kreditangebot für Ihre Bedürfnisse zu finden. Die Vergleichsergebnisse basieren 
                    auf den von Ihnen angegebenen Daten und den aktuellen Konditionen unserer Partnerbanken.
                  </p>

                  <h3>3.3 Beratungsleistungen</h3>
                  <p>
                    Unsere Finanzberater stehen Ihnen für persönliche Beratungsgespräche zur Verfügung. 
                    Die Beratung erfolgt unabhängig und orientiert sich an Ihren individuellen Bedürfnissen.
                  </p>

                  <h3>3.4 Online-Tools</h3>
                  <p>
                    Wir stellen verschiedene Online-Rechner zur Verfügung (Kreditrechner, 
                    Kreditfähigkeitsrechner). Diese dienen nur zur Orientierung und stellen keine 
                    verbindlichen Angebote dar.
                  </p>

                  <div className="legal-warning-box">
                    <strong>⚠️ Wichtig:</strong> FinanzPlus ist nicht berechtigt, Kredite zu vergeben 
                    oder Kreditentscheidungen zu treffen. Diese Entscheidungen liegen ausschließlich 
                    bei den Partnerbanken.
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div id="vertragsschluss" className="legal-section">
                <h2 className="legal-section-title">4. Vertragsschluss</h2>
                <div className="legal-text">
                  <h3>4.1 Angebot und Annahme</h3>
                  <p>
                    Die Darstellung unserer Dienstleistungen auf der Website stellt kein rechtlich 
                    bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots.
                  </p>

                  <h3>4.2 Kreditanfrage</h3>
                  <p>Der Vertragsschluss erfolgt in folgenden Schritten:</p>
                  <ol>
                    <li>Sie füllen das Online-Formular mit Ihren Daten aus</li>
                    <li>Sie erhalten eine Bestätigung Ihrer Anfrage per E-Mail</li>
                    <li>Wir prüfen Ihre Anfrage und leiten sie an geeignete Partnerbanken weiter</li>
                    <li>Sie erhalten Kreditangebote von den Banken</li>
                    <li>Sie entscheiden sich für ein Angebot und schließen den Vertrag direkt mit der Bank</li>
                  </ol>

                  <h3>4.3 Registrierung</h3>
                  <p>
                    Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. 
                    Mit der Registrierung kommt ein Nutzungsvertrag zustande.
                  </p>

                  <h3>4.4 Vertragssprache</h3>
                  <p>
                    Die Vertragssprache ist Deutsch. Der Vertragstext wird von uns gespeichert und 
                    kann von Ihnen jederzeit in Ihrem Benutzerkonto eingesehen werden.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="pflichten" className="legal-section">
                <h2 className="legal-section-title">5. Pflichten der Vertragsparteien</h2>
                <div className="legal-text">
                  <h3>5.1 Pflichten von FinanzPlus</h3>
                  <ul>
                    <li>Sorgfältige Prüfung und Weiterleitung Ihrer Kreditanfrage</li>
                    <li>Unabhängige und objektive Beratung</li>
                    <li>Schutz Ihrer personenbezogenen Daten gemäß DSGVO</li>
                    <li>Transparente Darstellung der Kreditkonditionen</li>
                    <li>Zeitnahe Bearbeitung Ihrer Anfragen</li>
                  </ul>

                  <h3>5.2 Pflichten des Kunden</h3>
                  <ul>
                    <li>Wahrheitsgemäße und vollständige Angabe aller erforderlichen Daten</li>
                    <li>Unverzügliche Mitteilung von Änderungen relevanter Daten</li>
                    <li>Sorgfältiger Umgang mit Zugangsdaten zum Benutzerkonto</li>
                    <li>Einhaltung der gesetzlichen Bestimmungen</li>
                    <li>Keine missbräuchliche Nutzung unserer Dienste</li>
                  </ul>

                  <h3>5.3 Mitwirkungspflichten</h3>
                  <p>
                    Sie verpflichten sich, alle für die Kreditvermittlung erforderlichen Unterlagen 
                    vollständig und fristgerecht bereitzustellen. Dazu gehören insbesondere:
                  </p>
                  <ul>
                    <li>Einkommensnachweise (Gehaltsabrechnungen, Steuerbescheide)</li>
                    <li>Identitätsnachweis (Personalausweis, Reisepass)</li>
                    <li>Wohnsitzbestätigung</li>
                    <li>Weitere von der Bank geforderte Dokumente</li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div id="verguetung" className="legal-section">
                <h2 className="legal-section-title">6. Vergütung und Kosten</h2>
                <div className="legal-text">
                  <h3>6.1 Kostenlose Dienstleistungen</h3>
                  <p>Folgende Leistungen sind für Sie kostenlos:</p>
                  <ul>
                    <li>Kreditvergleich und Kreditrechner</li>
                    <li>Kreditanfrage und -vermittlung</li>
                    <li>Erstberatung (bis 30 Minuten)</li>
                    <li>Nutzung der Website und Online-Tools</li>
                  </ul>

                  <h3>6.2 Provision</h3>
                  <p>
                    FinanzPlus erhält im Erfolgsfall eine Provision von der vermittelnden Bank. 
                    Diese Provision ist bereits in den Kreditkonditionen einkalkuliert und führt 
                    nicht zu zusätzlichen Kosten für Sie.
                  </p>

                  <h3>6.3 Kostenpflichtige Zusatzleistungen</h3>
                  <p>
                    Erweiterte Beratungsleistungen können kostenpflichtig sein. Sie werden vor 
                    Inanspruchnahme solcher Leistungen ausdrücklich auf die Kosten hingewiesen 
                    und müssen diesen zustimmen.
                  </p>

                  <div className="legal-highlight-box">
                    <h4>💰 Transparenzgarantie</h4>
                    <p>
                      Wir garantieren vollständige Transparenz über alle Kosten. Es entstehen keine 
                      versteckten Gebühren. Alle Kosten werden vor Vertragsschluss klar kommuniziert.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div id="haftung" className="legal-section">
                <h2 className="legal-section-title">7. Haftung und Gewährleistung</h2>
                <div className="legal-text">
                  <h3>7.1 Haftungsbeschränkung</h3>
                  <p>
                    FinanzPlus haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für 
                    Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
                  </p>
                  <p>
                    Bei leichter Fahrlässigkeit haftet FinanzPlus nur bei Verletzung wesentlicher 
                    Vertragspflichten (Kardinalpflichten). In diesem Fall ist die Haftung auf den 
                    vertragstypischen, vorhersehbaren Schaden begrenzt.
                  </p>

                  <h3>7.2 Keine Haftung für Kreditentscheidungen</h3>
                  <p>
                    FinanzPlus haftet nicht für die Kreditentscheidungen der Partnerbanken. Die 
                    Entscheidung über die Kreditvergabe liegt ausschließlich bei der jeweiligen Bank.
                  </p>

                  <h3>7.3 Keine Haftung für Drittinhalte</h3>
                  <p>
                    Unsere Website enthält Links zu externen Websites. Für die Inhalte dieser 
                    Websites übernehmen wir keine Haftung.
                  </p>

                  <h3>7.4 Verfügbarkeit</h3>
                  <p>
                    Wir bemühen uns um eine hohe Verfügbarkeit unserer Website. Eine Garantie für 
                    ununterbrochene Verfügbarkeit können wir jedoch nicht übernehmen. Wartungsarbeiten 
                    werden nach Möglichkeit angekündigt.
                  </p>

                  <h3>7.5 Datenverlust</h3>
                  <p>
                    FinanzPlus haftet nicht für Datenverluste, soweit diese durch regelmäßige 
                    Datensicherung durch den Kunden hätten vermieden werden können.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div id="datenschutz" className="legal-section">
                <h2 className="legal-section-title">8. Datenschutz</h2>
                <div className="legal-text">
                  <p>
                    Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Detaillierte Informationen 
                    zur Datenverarbeitung finden Sie in unserer{' '}
                    <Link to="/datenschutz" className="legal-link">Datenschutzerklärung</Link>.
                  </p>

                  <h3>8.1 Datenverarbeitung</h3>
                  <p>
                    Wir verarbeiten Ihre Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen 
                    (DSGVO, DSG) und nur für die Zwecke, für die Sie uns Ihre Daten zur Verfügung 
                    gestellt haben.
                  </p>

                  <h3>8.2 Weitergabe an Partnerbanken</h3>
                  <p>
                    Für die Kreditvermittlung ist es erforderlich, Ihre Daten an unsere Partnerbanken 
                    weiterzugeben. Dies erfolgt nur mit Ihrer ausdrücklichen Einwilligung.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div id="widerrufsrecht" className="legal-section">
                <h2 className="legal-section-title">9. Widerrufsrecht für Verbraucher</h2>
                <div className="legal-text">
                  <div className="legal-highlight-box">
                    <h3>Widerrufsbelehrung</h3>
                    <p><strong>Widerrufsrecht</strong></p>
                    <p>
                      Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen 
                      Vertrag zu widerrufen.
                    </p>
                    <p>
                      Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
                    </p>
                    <p>
                      Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen 
                      Erklärung (z.B. per Post, E-Mail oder Fax) über Ihren Entschluss, diesen 
                      Vertrag zu widerrufen, informieren.
                    </p>
                    <p><strong>Kontakt für Widerruf:</strong></p>
                    <p>
                      FinanzPlus Austria GmbH<br />
                      Kärntner Ring 5-7<br />
                      1010 Wien<br />
                      E-Mail: widerruf@finanzplus.at<br />
                      Fax: +43 1 234 5679
                    </p>
                    <p>
                      Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über 
                      die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
                    </p>
                  </div>

                  <h3>9.1 Folgen des Widerrufs</h3>
                  <p>
                    Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von 
                    Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem 
                    Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags 
                    bei uns eingegangen ist.
                  </p>

                  <h3>9.2 Vorzeitige Erfüllung</h3>
                  <p>
                    Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen 
                    sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der 
                    bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts 
                    hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen 
                    im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
                  </p>
                </div>
              </div>

              {/* Section 10 */}
              <div id="kuendigung" className="legal-section">
                <h2 className="legal-section-title">10. Kündigung und Vertragslaufzeit</h2>
                <div className="legal-text">
                  <h3>10.1 Laufzeit</h3>
                  <p>
                    Der Vermittlungsvertrag endet automatisch mit der erfolgreichen Vermittlung eines 
                    Kredits oder mit der Ablehnung durch alle angefragten Banken.
                  </p>

                  <h3>10.2 Ordentliche Kündigung</h3>
                  <p>
                    Sie können den Vermittlungsauftrag jederzeit ohne Angabe von Gründen kündigen. 
                    Die Kündigung muss schriftlich (per E-Mail ausreichend) erfolgen.
                  </p>

                  <h3>10.3 Außerordentliche Kündigung</h3>
                  <p>
                    Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. 
                    Ein wichtiger Grund liegt insbesondere vor bei:
                  </p>
                  <ul>
                    <li>Falschen oder unvollständigen Angaben des Kunden</li>
                    <li>Missbräuchlicher Nutzung unserer Dienste</li>
                    <li>Verstoß gegen diese AGB</li>
                    <li>Zahlungsverzug bei kostenpflichtigen Leistungen</li>
                  </ul>

                  <h3>10.4 Benutzerkonto</h3>
                  <p>
                    Sie können Ihr Benutzerkonto jederzeit löschen. Nach der Löschung werden Ihre 
                    Daten gemäß unserer Datenschutzerklärung behandelt.
                  </p>
                </div>
              </div>

              {/* Section 11 */}
              <div id="streitbeilegung" className="legal-section">
                <h2 className="legal-section-title">11. Streitbeilegung</h2>
                <div className="legal-text">
                  <h3>11.1 Online-Streitbeilegung</h3>
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) 
                    bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="legal-link">
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </p>

                  <h3>11.2 Verbraucherschlichtung</h3>
                  <p>
                    Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer 
                    Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
                  </p>

                  <h3>11.3 Gerichtsstand</h3>
                  <p>
                    Für alle Streitigkeiten aus diesem Vertrag gilt österreichisches Recht unter 
                    Ausschluss des UN-Kaufrechts. Gerichtsstand ist Wien, sofern der Kunde Kaufmann, 
                    juristische Person des öffentlichen Rechts oder öffentlich-rechtliches 
                    Sondervermögen ist.
                  </p>
                </div>
              </div>

              {/* Section 12 */}
              <div id="schlussbestimmungen" className="legal-section">
                <h2 className="legal-section-title">12. Schlussbestimmungen</h2>
                <div className="legal-text">
                  <h3>12.1 Änderungen der AGB</h3>
                  <p>
                    Wir behalten uns vor, diese AGB jederzeit zu ändern. Änderungen werden Ihnen 
                    mindestens 4 Wochen vor Inkrafttreten per E-Mail mitgeteilt. Widersprechen Sie 
                    nicht innerhalb von 4 Wochen, gelten die geänderten AGB als angenommen.
                  </p>

                  <h3>12.2 Salvatorische Klausel</h3>
                  <p>
                    Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die 
                    Wirksamkeit der übrigen Bestimmungen hiervon unberührt. Die unwirksame Bestimmung 
                    wird durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck der unwirksamen 
                    Bestimmung am nächsten kommt.
                  </p>

                  <h3>12.3 Schriftform</h3>
                  <p>
                    Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch 
                    für die Änderung dieser Schriftformklausel. E-Mail genügt der Schriftform.
                  </p>

                  <h3>12.4 Abtretung</h3>
                  <p>
                    Die Abtretung von Rechten und Pflichten aus diesem Vertrag durch den Kunden 
                    bedarf unserer vorherigen schriftlichen Zustimmung.
                  </p>

                  <h3>12.5 Vertragssprache</h3>
                  <p>
                    Diese AGB sind in deutscher Sprache verfasst. Vertragssprache ist ausschließlich 
                    Deutsch.
                  </p>
                </div>
              </div>

              {/* Version Info */}
              <div className="legal-section">
                <div className="legal-info-box">
                  <p><strong>Version:</strong> 2.0</p>
                  <p><strong>Stand:</strong> 1. Januar 2026</p>
                  <p><strong>Gültig ab:</strong> 1. Januar 2026</p>
                  <p>
                    <strong>Frühere Versionen:</strong> Auf Anfrage erhältlich unter{' '}
                    <a href="mailto:Kontakt_finanzplusaustria@proton.me" className="legal-link">Kontakt_finanzplusaustria@proton.me</a>
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="legal-cta">
                <h3>Haben Sie Fragen zu unseren AGB?</h3>
                <p>Unser Kundenservice-Team steht Ihnen gerne zur Verfügung.</p>
                <div className="legal-cta-buttons">
                  <Link to="/kontakt" className="btn btn-primary">
                    💬 Kontakt aufnehmen
                  </Link>
                  <a href="tel:+49 155 65236794" className="btn btn-secondary">
                    📞 Anrufen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AGB;

// Made with Bob
