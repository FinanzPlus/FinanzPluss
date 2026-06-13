import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalDocuments: 0,
    verifiedDocuments: 0,
    creditScore: 0,
    unreadNotifications: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch statistics
      const statsResponse = await fetch('http://localhost:5000/api/loans/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        const requests = statsData.data;
        setStats({
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          approvedRequests: requests.filter(r => r.status === 'approved').length,
          rejectedRequests: requests.filter(r => r.status === 'rejected').length,
          totalDocuments: 0, // Will be updated from documents endpoint
          verifiedDocuments: 0,
          creditScore: 0, // Will be updated from credit score endpoint
          unreadNotifications: 0
        });
        
        // Get recent 5 requests
        setRecentRequests(requests.slice(0, 5));
      }

      // Fetch credit score
      const scoreResponse = await fetch('http://localhost:5000/api/credit-score/my-score', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const scoreData = await scoreResponse.json();
      
      if (scoreData.success && scoreData.data) {
        setStats(prev => ({
          ...prev,
          creditScore: scoreData.data.score
        }));
      }

      // Fetch notifications
      const notifResponse = await fetch('http://localhost:5000/api/notifications/my-notifications?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const notifData = await notifResponse.json();
      
      if (notifData.success) {
        setRecentNotifications(notifData.data);
        setStats(prev => ({
          ...prev,
          unreadNotifications: notifData.data.filter(n => !n.is_read).length
        }));
      }

      // Fetch documents count
      const docsResponse = await fetch('http://localhost:5000/api/documents/my-documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const docsData = await docsResponse.json();
      
      if (docsData.success) {
        setStats(prev => ({
          ...prev,
          totalDocuments: docsData.data.length,
          verifiedDocuments: docsData.data.filter(d => d.verification_status === 'verified').length
        }));
      }

    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'In Bearbeitung', class: 'status-pending' },
      approved: { text: 'Genehmigt', class: 'status-approved' },
      rejected: { text: 'Abgelehnt', class: 'status-rejected' },
      in_review: { text: 'Wird geprüft', class: 'status-review' }
    };
    
    const badge = badges[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'excellent';
    if (score >= 650) return 'good';
    if (score >= 550) return 'fair';
    return 'poor';
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Willkommen zurück, {user?.first_name}!</h1>
          <p className="header-subtitle">Hier ist eine Übersicht Ihrer Kreditanfragen und Ihres Kontos</p>
        </div>
        <Link to="/loan-simulator" className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Neue Kreditanfrage
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon requests">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRequests}</h3>
            <p>Gesamte Anfragen</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>In Bearbeitung</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon approved">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.approvedRequests}</h3>
            <p>Genehmigt</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon score">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3 className={`credit-score ${getCreditScoreColor(stats.creditScore)}`}>
              {stats.creditScore || 'N/A'}
            </h3>
            <p>Kredit-Score</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Schnellzugriff</h2>
        <div className="actions-grid">
          <Link to="/user/loan-history" className="action-card">
            <div className="action-icon">
              <i className="fas fa-history"></i>
            </div>
            <h3>Kreditverlauf</h3>
            <p>Alle Ihre Kreditanfragen anzeigen</p>
          </Link>

          <Link to="/user/documents" className="action-card">
            <div className="action-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h3>Dokumente</h3>
            <p>{stats.verifiedDocuments}/{stats.totalDocuments} verifiziert</p>
          </Link>

          <Link to="/user/credit-score" className="action-card">
            <div className="action-icon">
              <i className="fas fa-star"></i>
            </div>
            <h3>Kredit-Score</h3>
            <p>Ihre Kreditwürdigkeit verbessern</p>
          </Link>

          <Link to="/user/notifications" className="action-card">
            <div className="action-icon">
              <i className="fas fa-bell"></i>
              {stats.unreadNotifications > 0 && (
                <span className="notification-badge">{stats.unreadNotifications}</span>
              )}
            </div>
            <h3>Benachrichtigungen</h3>
            <p>{stats.unreadNotifications} ungelesen</p>
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Letzte Kreditanfragen</h2>
          <Link to="/user/loan-history" className="view-all">
            Alle anzeigen <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Betrag</th>
                  <th>Zweck</th>
                  <th>Partner</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(request => (
                  <tr key={request.id}>
                    <td>{formatDate(request.created_at)}</td>
                    <td className="amount">{formatCurrency(request.loan_amount)}</td>
                    <td>{request.loan_purpose}</td>
                    <td>{request.partner_name || 'Alle Partner'}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <Link to={`/user/loan-history/${request.id}`} className="btn-icon" title="Details anzeigen">
                        <i className="fas fa-eye"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Sie haben noch keine Kreditanfragen gestellt</p>
            <Link to="/loan-simulator" className="btn btn-primary">
              Erste Anfrage erstellen
            </Link>
          </div>
        )}
      </div>

      {/* Recent Notifications */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Letzte Benachrichtigungen</h2>
          <Link to="/user/notifications" className="view-all">
            Alle anzeigen <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {recentNotifications.length > 0 ? (
          <div className="notifications-list">
            {recentNotifications.map(notification => (
              <div key={notification.id} className={`notification-item ${!notification.is_read ? 'unread' : ''}`}>
                <div className="notification-icon">
                  <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : notification.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{formatDate(notification.created_at)}</span>
                </div>
                {!notification.is_read && <span className="unread-dot"></span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-bell-slash"></i>
            <p>Keine Benachrichtigungen</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

// Made with Bob
