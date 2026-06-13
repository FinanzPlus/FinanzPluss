import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import api from '../../services/api';
import './ReviewList.css';

const ReviewList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [productId, refreshTrigger]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/comments/product/${productId}`);
      setReviews(response.data.comments);
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Fehler beim Laden der Bewertungen');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="reviews-loading">Bewertungen werden geladen...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  return (
    <div className="review-list">
      {/* Rating Summary */}
      {stats && stats.total_reviews > 0 && (
        <div className="rating-summary">
          <div className="rating-overview">
            <div className="average-rating">
              <span className="rating-number">{stats.average_rating.toFixed(1)}</span>
              <RatingStars rating={Math.round(stats.average_rating)} size="large" />
              <span className="total-reviews">
                {stats.total_reviews} {stats.total_reviews === 1 ? 'Bewertung' : 'Bewertungen'}
              </span>
            </div>

            {stats.distribution && (
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = stats.distribution[rating] || 0;
                  const percentage = stats.total_reviews > 0 
                    ? (count / stats.total_reviews) * 100 
                    : 0;

                  return (
                    <div key={rating} className="distribution-row">
                      <span className="rating-label">{rating} ★</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="rating-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-container">
        <h3>Kundenbewertungen</h3>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Noch keine Bewertungen vorhanden.</p>
            <p>Seien Sie der Erste, der dieses Produkt bewertet!</p>
          </div>
        ) : (
          <div className="reviews-items">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.first_name?.charAt(0)}{review.last_name?.charAt(0)}
                    </div>
                    <div className="reviewer-details">
                      <span className="reviewer-name">
                        {review.first_name} {review.last_name?.charAt(0)}.
                      </span>
                      <span className="review-date">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} size="medium" />
                </div>

                <div className="review-content">
                  <p>{review.comment_text}</p>
                </div>

                {review.admin_notes && (
                  <div className="admin-response">
                    <strong>Antwort vom Team:</strong>
                    <p>{review.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;

// Made with Bob
