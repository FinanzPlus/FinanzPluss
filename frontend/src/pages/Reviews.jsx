import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import './Reviews.css';

const Reviews = () => {
  const { user } = useAuth();
  
  // États
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // État du formulaire
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    loanType: 'auto'
  });
  const [submitting, setSubmitting] = useState(false);

  // Données des avis (simulées - à remplacer par API)
  const reviewsData = [
    {
      id: 1,
      userName: 'Michael K.',
      userInitials: 'MK',
      rating: 5,
      title: 'Hervorragender Service!',
      comment: 'Die Beratung war erstklassig und ich habe innerhalb von 24 Stunden eine Zusage erhalten. Die Konditionen waren deutlich besser als bei meiner Hausbank. Absolut empfehlenswert!',
      loanType: 'Autokredit',
      loanAmount: 25000,
      date: '2024-05-15',
      verified: true,
      helpful: 45
    },
    {
      id: 2,
      userName: 'Sarah M.',
      userInitials: 'SM',
      rating: 5,
      title: 'Schnell und unkompliziert',
      comment: 'Ich war positiv überrascht, wie einfach der gesamte Prozess war. Vom ersten Kontakt bis zur Auszahlung vergingen nur 3 Tage. Das Team war immer erreichbar und sehr hilfsbereit.',
      loanType: 'Wohnkredit',
      loanAmount: 150000,
      date: '2024-05-10',
      verified: true,
      helpful: 38
    },
    {
      id: 3,
      userName: 'Thomas W.',
      userInitials: 'TW',
      rating: 4,
      title: 'Gute Konditionen',
      comment: 'Der Vergleich der verschiedenen Bankangebote hat sich gelohnt. Ich konnte 0,4% Zinsen sparen. Einziger Minuspunkt: Die Dokumentenprüfung hat etwas länger gedauert als erwartet.',
      loanType: 'Privatkredit',
      loanAmount: 15000,
      date: '2024-05-05',
      verified: true,
      helpful: 29
    },
    {
      id: 4,
      userName: 'Lisa H.',
      userInitials: 'LH',
      rating: 5,
      title: 'Professionelle Beratung',
      comment: 'Als Selbstständige hatte ich Bedenken wegen der Kreditvergabe. Das Team von FinanzPlus hat mir geholfen, alle notwendigen Unterlagen zusammenzustellen und die beste Bank für meine Situation zu finden.',
      loanType: 'Geschäftskredit',
      loanAmount: 50000,
      date: '2024-04-28',
      verified: true,
      helpful: 52
    },
    {
      id: 5,
      userName: 'Andreas P.',
      userInitials: 'AP',
      rating: 5,
      title: 'Transparenz und Fairness',
      comment: 'Keine versteckten Kosten, alles wurde klar kommuniziert. Der Online-Rechner ist sehr hilfreich und die Ergebnisse waren genau wie versprochen. Würde ich jederzeit wieder nutzen!',
      loanType: 'Autokredit',
      loanAmount: 30000,
      date: '2024-04-20',
      verified: true,
      helpful: 41
    },
    {
      id: 6,
      userName: 'Julia S.',
      userInitials: 'JS',
      rating: 4,
      title: 'Sehr zufrieden',
      comment: 'Der Service war gut, die Zinsen fair. Die Bearbeitung ging schnell. Einen Stern Abzug, weil die telefonische Erreichbarkeit manchmal schwierig war.',
      loanType: 'Renovierung',
      loanAmount: 20000,
      date: '2024-04-15',
      verified: true,
      helpful: 23
    },
    {
      id: 7,
      userName: 'Martin B.',
      userInitials: 'MB',
      rating: 5,
      title: 'Beste Entscheidung!',
      comment: 'Ich habe mehrere Kreditvermittler verglichen und FinanzPlus Austria hat mich am meisten überzeugt. Persönliche Betreuung, faire Konditionen und schnelle Abwicklung.',
      loanType: 'Wohnkredit',
      loanAmount: 200000,
      date: '2024-04-10',
      verified: true,
      helpful: 67
    },
    {
      id: 8,
      userName: 'Christina F.',
      userInitials: 'CF',
      rating: 5,
      title: 'Kompetent und freundlich',
      comment: 'Das Team hat sich viel Zeit genommen, um meine Fragen zu beantworten. Ich fühlte mich gut beraten und nicht unter Druck gesetzt. Top Service!',
      loanType: 'Bildungskredit',
      loanAmount: 12000,
      date: '2024-04-05',
      verified: true,
      helpful: 31
    }
  ];

  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => {
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
      setLoading(false);
    }, 500);
  }, []);

  // Calculer les statistiques
  const stats = {
    total: reviews.length,
    average: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0,
    distribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    }
  };

  // Filtrer et trier
  useEffect(() => {
    let filtered = [...reviews];

    // Filtrer par note
    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(filterRating));
    }

    // Trier
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredReviews(filtered);
  }, [filterRating, sortBy, reviews]);

  // Gérer le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simuler l'envoi
    setTimeout(() => {
      const newReview = {
        id: reviews.length + 1,
        userName: user?.name || 'Anonymer Nutzer',
        userInitials: user?.name?.split(' ').map(n => n[0]).join('') || 'AN',
        rating: parseInt(formData.rating),
        title: formData.title,
        comment: formData.comment,
        loanType: formData.loanType,
        date: new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0
      };

      setReviews([newReview, ...reviews]);
      setFormData({ rating: 5, title: '', comment: '', loanType: 'auto' });
      setShowForm(false);
      setSubmitting(false);
      
      // Message de succès (à implémenter avec un toast)
      alert('Vielen Dank für Ihre Bewertung! Sie wird nach Prüfung veröffentlicht.');
    }, 1000);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="reviews-page">
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="container">
          <h1>⭐ Kundenbewertungen</h1>
          <p className="hero-subtitle">
            Erfahrungen echter Kunden mit FinanzPlus Austria
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="reviews-stats-section">
        <div className="container">
          <div className="stats-card">
            <div className="stats-overview">
              <div className="average-rating">
                <span className="rating-number">{stats.average}</span>
                <div className="rating-stars">
                  {'⭐'.repeat(Math.round(stats.average))}
                </div>
                <span className="rating-count">Basierend auf {stats.total} Bewertungen</span>
              </div>
            </div>
            
            <div className="stats-distribution">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.distribution[rating];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <div key={rating} className="distribution-row">
                    <span className="distribution-label">{rating} ⭐</span>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="distribution-count">{count}</span>
                  </div>
                );
              })}
            </div>

            {user ? (
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Formular schließen' : 'Bewertung schreiben'}
              </Button>
            ) : (
              <div className="login-prompt">
                <p>Melden Sie sich an, um eine Bewertung zu schreiben</p>
                <Button variant="outline" size="large" fullWidth>
                  Jetzt anmelden
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Form */}
      {showForm && user && (
        <section className="review-form-section">
          <div className="container">
            <div className="review-form-card">
              <h2>Ihre Bewertung schreiben</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Bewertung *</label>
                  <div className="rating-input">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <label key={rating} className="rating-option">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={formData.rating === rating}
                          onChange={handleInputChange}
                        />
                        <span className="rating-stars">
                          {'⭐'.repeat(rating)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="loanType">Kreditart *</label>
                  <select
                    id="loanType"
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="auto">Autokredit</option>
                    <option value="home">Wohnkredit</option>
                    <option value="personal">Privatkredit</option>
                    <option value="business">Geschäftskredit</option>
                    <option value="renovation">Renovierung</option>
                    <option value="education">Bildungskredit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Titel *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="z.B. Hervorragender Service"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Ihre Erfahrung *</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Teilen Sie Ihre Erfahrung mit FinanzPlus Austria..."
                    required
                    rows={6}
                    maxLength={1000}
                  />
                  <span className="char-count">
                    {formData.comment.length}/1000 Zeichen
                  </span>
                </div>

                <div className="form-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    loading={submitting}
                  >
                    {submitting ? 'Wird gesendet...' : 'Bewertung absenden'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="reviews-filters">
        <div className="container">
          <div className="filters-bar">
            <div className="filter-group">
              <label>Filtern nach:</label>
              <select 
                value={filterRating} 
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-select"
              >
                <option value="all">Alle Bewertungen</option>
                <option value="5">5 Sterne</option>
                <option value="4">4 Sterne</option>
                <option value="3">3 Sterne</option>
                <option value="2">2 Sterne</option>
                <option value="1">1 Stern</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sortieren nach:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Neueste zuerst</option>
                <option value="helpful">Hilfreichste</option>
                <option value="rating">Höchste Bewertung</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="reviews-list-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Bewertungen werden geladen...</p>
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="reviews-grid">
              {filteredReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="user-avatar">{review.userInitials}</div>
                      <div className="user-info">
                        <span className="user-name">{review.userName}</span>
                        {review.verified && (
                          <span className="verified-badge">✓ Verifiziert</span>
                        )}
                      </div>
                    </div>
                    <div className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>

                  <h3 className="review-title">{review.title}</h3>
                  
                  <p className="review-comment">{review.comment}</p>

                  <div className="review-meta">
                    <span className="review-loan-type">
                      💼 {review.loanType}
                    </span>
                    {review.loanAmount && (
                      <span className="review-amount">
                        💰 €{review.loanAmount.toLocaleString('de-AT')}
                      </span>
                    )}
                  </div>

                  <div className="review-footer">
                    <span className="review-date">{formatDate(review.date)}</span>
                    <button className="helpful-button">
                      👍 Hilfreich ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h3>Keine Bewertungen gefunden</h3>
              <p>Versuchen Sie einen anderen Filter</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reviews;

// Made with Bob
