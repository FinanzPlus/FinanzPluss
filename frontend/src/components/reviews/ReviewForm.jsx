import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';
import api from '../../services/api';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment_text: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    setError(null);
  };

  const handleTextChange = (e) => {
    setFormData(prev => ({ ...prev, comment_text: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    // Validation
    if (formData.rating === 0) {
      setError('Bitte wählen Sie eine Bewertung aus');
      return;
    }

    if (formData.comment_text.length < 10) {
      setError('Der Kommentar muss mindestens 10 Zeichen lang sein');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/comments', {
        product_id: productId,
        rating: formData.rating,
        comment_text: formData.comment_text
      });

      setSuccess(true);
      setFormData({ rating: 0, comment_text: '' });
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Fehler beim Einreichen der Bewertung');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="review-form-login">
        <p>Sie müssen angemeldet sein, um eine Bewertung abzugeben.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Anmelden
        </button>
      </div>
    );
  }

  return (
    <div className="review-form">
      <h3>Bewertung schreiben</h3>
      
      {success && (
        <div className="success-message">
          ✓ Ihre Bewertung wurde eingereicht und wartet auf Genehmigung. Vielen Dank!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Ihre Bewertung <span className="required">*</span>
          </label>
          <RatingStars
            rating={formData.rating}
            size="large"
            interactive={true}
            onRatingChange={handleRatingChange}
          />
          {formData.rating > 0 && (
            <span className="rating-text">
              {formData.rating} von 5 Sternen
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="comment">
            Ihr Kommentar <span className="required">*</span>
          </label>
          <textarea
            id="comment"
            value={formData.comment_text}
            onChange={handleTextChange}
            placeholder="Teilen Sie Ihre Erfahrungen mit diesem Produkt..."
            rows="5"
            className="form-textarea"
            disabled={submitting}
          />
          <div className="char-count">
            {formData.comment_text.length} Zeichen (mindestens 10)
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitting || formData.rating === 0 || formData.comment_text.length < 10}
        >
          {submitting ? 'Wird eingereicht...' : 'Bewertung absenden'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

// Made with Bob
