import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    pendingComments: 0,
    pendingMessages: 0,
    pendingLoans: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load various statistics
      const [products, comments, messages, loans] = await Promise.all([
        api.get('/products'),
        api.get('/comments?status=pending'),
        api.get('/contact/messages?status=pending'),
        api.get('/financial/loan-requests?status=pending')
      ]);

      setStats({
        totalProducts: products.data.products?.length || 0,
        totalUsers: 0, // Would need a users endpoint
        pendingComments: comments.data.pending_count || 0,
        pendingMessages: messages.data.pending_count || 0,
        pendingLoans: loans.data.length || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading">Dashboard wird geladen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Willkommen zurück, {user?.first_name}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Produkte</h3>
              <p className="stat-number">{stats.totalProducts}</p>
              <button 
                onClick={() => navigate('/admin/products')}
                className="stat-link"
              >
                Verwalten →
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <h3>Ausstehende Bewertungen</h3>
              <p className="stat-number">{stats.pendingComments}</p>
              <button 
                onClick={() => navigate('/admin/comments')}
                className="stat-link"
              >
                Moderieren →
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-content">
              <h3>Neue Nachrichten</h3>
              <p className="stat-number">{stats.pendingMessages}</p>
              <button 
                onClick={() => navigate('/admin/messages')}
                className="stat-link"
              >
                Anzeigen →
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Kreditanfragen</h3>
              <p className="stat-number">{stats.pendingLoans}</p>
              <button 
                onClick={() => navigate('/admin/loans')}
                className="stat-link"
              >
                Bearbeiten →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Schnellzugriff</h2>
          <div className="actions-grid">
            <button 
              onClick={() => navigate('/admin/products/new')}
              className="action-btn"
            >
              <span className="action-icon">➕</span>
              <span>Neues Produkt</span>
            </button>

            <button 
              onClick={() => navigate('/admin/opening-hours')}
              className="action-btn"
            >
              <span className="action-icon">🕐</span>
              <span>Öffnungszeiten</span>
            </button>

            <button 
              onClick={() => navigate('/admin/users')}
              className="action-btn"
            >
              <span className="action-icon">👥</span>
              <span>Benutzer</span>
            </button>

            <button 
              onClick={() => navigate('/admin/settings')}
              className="action-btn"
            >
              <span className="action-icon">⚙️</span>
              <span>Einstellungen</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Letzte Aktivitäten</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📦</span>
              <div className="activity-content">
                <p className="activity-text">Neue Produkte wurden hinzugefügt</p>
                <span className="activity-time">Vor 2 Stunden</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💬</span>
              <div className="activity-content">
                <p className="activity-text">{stats.pendingComments} Bewertungen warten auf Moderation</p>
                <span className="activity-time">Heute</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📧</span>
              <div className="activity-content">
                <p className="activity-text">{stats.pendingMessages} neue Kontaktanfragen</p>
                <span className="activity-time">Heute</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
