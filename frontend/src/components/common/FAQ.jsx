import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Allgemein',
      questions: [
        {
          question: 'Wie funktioniert FinanzPlus Austria?',
          answer: 'FinanzPlus Austria ist Ihr kostenloser Kreditvermittler. Wir vergleichen Angebote von über 20 österreichischen Banken und finden für Sie die besten Konditionen. Der Service ist für Sie völlig kostenlos und unverbindlich.'
        },
        {
          question: 'Ist der Service wirklich kostenlos?',
          answer: 'Ja, unser Service ist für Sie als Kunde vollständig kostenlos. Wir erhalten eine Provision von den Banken, wenn ein Kredit erfolgreich vermittelt wird. Dies hat keinen Einfluss auf Ihre Konditionen.'
        },
        {
          question: 'Wie lange dauert die Kreditbearbeitung?',
          answer: 'Nach Einreichung Ihrer vollständigen Unterlagen erhalten Sie in der Regel innerhalb von 24-48 Stunden eine Rückmeldung. Bei positiver Entscheidung kann die Auszahlung innerhalb von 3-5 Werktagen erfolgen.'
        }
      ]
    },
    {
      category: 'Kreditantrag',
      questions: [
        {
          question: 'Welche Unterlagen benötige ich?',
          answer: 'Für einen Kreditantrag benötigen Sie: Personalausweis oder Reisepass, Einkommensnachweise der letzten 3 Monate, aktuelle Kontoauszüge und ggf. bestehende Kreditverträge. Alle Dokumente können Sie bequem online hochladen.'
        },
        {
          question: 'Kann ich mehrere Kreditangebote erhalten?',
          answer: 'Ja, Sie erhalten von uns bis zu 3 verschiedene Kreditangebote von unterschiedlichen Banken. So können Sie die Konditionen vergleichen und das beste Angebot für sich auswählen.'
        },
        {
          question: 'Beeinflusst die Anfrage meinen Schufa-Score?',
          answer: 'Nein, unsere Kreditanfrage ist Schufa-neutral. Erst wenn Sie sich für ein konkretes Angebot entscheiden und den Vertrag unterschreiben, wird dies bei der Schufa vermerkt.'
        }
      ]
    },
    {
      category: 'Konditionen',
      questions: [
        {
          question: 'Welche Kreditsummen sind möglich?',
          answer: 'Bei FinanzPlus Austria können Sie Kredite von 5.000 € bis 200.000 € beantragen. Die genaue Höhe hängt von Ihrer Bonität und Ihrem Einkommen ab.'
        },
        {
          question: 'Welche Laufzeiten werden angeboten?',
          answer: 'Die Kreditlaufzeit kann zwischen 12 und 240 Monaten (1-20 Jahre) gewählt werden. Längere Laufzeiten bedeuten niedrigere monatliche Raten, aber höhere Gesamtkosten.'
        },
        {
          question: 'Sind Sondertilgungen möglich?',
          answer: 'Ja, bei den meisten unserer Partnerbanken sind kostenlose Sondertilgungen möglich. Die genauen Konditionen variieren je nach Bank und werden Ihnen im Angebot transparent dargestellt.'
        }
      ]
    },
    {
      category: 'Sicherheit',
      questions: [
        {
          question: 'Wie sicher sind meine Daten?',
          answer: 'Ihre Daten werden mit modernster SSL-Verschlüsselung (256-Bit) übertragen und auf sicheren Servern in Österreich gespeichert. Wir sind DSGVO-konform und geben Ihre Daten nur mit Ihrer Zustimmung an Banken weiter.'
        },
        {
          question: 'Wer hat Zugriff auf meine Unterlagen?',
          answer: 'Nur Sie und die von Ihnen ausgewählten Banken haben Zugriff auf Ihre Unterlagen. Unsere Mitarbeiter können Dokumente nur zur Prüfung und Unterstützung einsehen. Alle Zugriffe werden protokolliert.'
        }
      ]
    }
  ];

  const toggleAccordion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h2>Häufig gestellte Fragen</h2>
        <p className="faq-subtitle">Finden Sie schnell Antworten auf Ihre Fragen</p>
      </div>

      <div className="faq-search">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Suchen Sie nach Stichwörtern..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="clear-search">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <div className="faq-container">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h3 className="category-title">
                <i className="fas fa-folder"></i>
                {category.category}
              </h3>
              <div className="faq-list">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isActive = activeIndex === index;
                  
                  return (
                    <div key={questionIndex} className={`faq-item ${isActive ? 'active' : ''}`}>
                      <button
                        className="faq-question"
                        onClick={() => toggleAccordion(categoryIndex, questionIndex)}
                      >
                        <span>{faq.question}</span>
                        <i className={`fas fa-chevron-${isActive ? 'up' : 'down'}`}></i>
                      </button>
                      <div className={`faq-answer ${isActive ? 'show' : ''}`}>
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>Keine Ergebnisse für "{searchTerm}" gefunden</p>
            <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
              Suche zurücksetzen
            </button>
          </div>
        )}
      </div>

      <div className="faq-contact">
        <i className="fas fa-question-circle"></i>
        <div>
          <h4>Ihre Frage wurde nicht beantwortet?</h4>
          <p>Kontaktieren Sie uns gerne direkt. Unser Team hilft Ihnen weiter!</p>
          <div className="contact-buttons">
            <a href="/contact" className="btn btn-primary">
              <i className="fas fa-envelope"></i>
              Kontakt aufnehmen
            </a>
            <a href="https://wa.me/4915565236794" className="btn btn-success" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
              WhatsApp Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

// Made with Bob
