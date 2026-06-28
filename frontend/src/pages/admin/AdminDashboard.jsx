import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalRevenue: 0,
    avgLoanAmount: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch loan requests statistics
      const requestsResponse = await fetch('http://localhost:5000/api/loans/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const requestsData = await requestsResponse.json();
      
      if (requestsData.success) {
        setStats(prev => ({
          ...prev,
          totalRequests: requestsData.data.total || 0,
          pendingRequests: requestsData.data.pending || 0,
          approvedRequests: requestsData.data.approved || 0,
          rejectedRequests: requestsData.data.rejected || 0,
          avgLoanAmount: requestsData.data.average_amount || 0
        }));
      }

      // Fetch recent loan requests
      const recentRequestsResponse = await fetch('http://localhost:5000/api/loans?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const recentRequestsData = await recentRequestsResponse.json();
      
      if (recentRequestsData.success) {
        setRecentRequests(recentRequestsData.data);
      }

      // Fetch users count (simulated - you may need to create this endpoint)
      setStats(prev => ({
        ...prev,
        totalUsers: 150,
        newUsersThisMonth: 23
      }));

      // Fetch reviews count (simulated)
      setStats(prev => ({
        ...prev,
        totalReviews: 87,
        pendingReviews: 5
      }));

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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p className="header-subtitle">Übersicht und Verwaltung der Plattform</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRequests}</h3>
            <p>Gesamte Anfragen</p>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +12% vs. letzter Monat
            </span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>Ausstehende Anfragen</p>
            <Link to="/admin/loan-requests?status=pending" className="stat-link">
              Jetzt bearbeiten <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.approvedRequests}</h3>
            <p>Genehmigte Anfragen</p>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +8% vs. letzter Monat
            </span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Registrierte Benutzer</p>
            <span className="stat-detail">+{stats.newUsersThisMonth} diesen Monat</span>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalReviews}</h3>
            <p>Bewertungen</p>
            {stats.pendingReviews > 0 && (
              <Link to="/admin/reviews?status=pending" className="stat-link">
                {stats.pendingReviews} zur Moderation <i className="fas fa-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>

        <div className="stat-card gradient">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.avgLoanAmount)}</h3>
            <p>Durchschn. Kreditbetrag</p>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +5% vs. letzter Monat
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Schnellzugriff</h2>
        <div className="actions-grid">
          <Link to="/admin/loan-requests" className="action-card">
            <div className="action-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <h3>Kreditanfragen</h3>
            <p>Anfragen verwalten und bearbeiten</p>
            {stats.pendingRequests > 0 && (
              <span className="action-badge">{stats.pendingRequests}</span>
            )}
          </Link>

          <Link to="/admin/users" className="action-card">
            <div className="action-icon">
              <i className="fas fa-users-cog"></i>
            </div>
            <h3>Benutzerverwaltung</h3>
            <p>Benutzer anzeigen und verwalten</p>
          </Link>

          <Link to="/admin/reviews" className="action-card">
            <div className="action-icon">
              <i className="fas fa-comments"></i>
            </div>
            <h3>Bewertungen</h3>
            <p>Bewertungen moderieren</p>
            {stats.pendingReviews > 0 && (
              <span className="action-badge">{stats.pendingReviews}</span>
            )}
          </Link>


          <Link to="/admin/statistics" className="action-card">
            <div className="action-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <h3>Statistiken</h3>
            <p>Detaillierte Analysen anzeigen</p>
          </Link>

          <Link to="/admin/settings" className="action-card">
            <div className="action-icon">
              <i className="fas fa-cog"></i>
            </div>
            <h3>Einstellungen</h3>
            <p>Systemkonfiguration</p>
          </Link>
        </div>
      </div>

      {/* Recent Loan Requests */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Letzte Kreditanfragen</h2>
          <Link to="/admin/loan-requests" className="view-all">
            Alle anzeigen <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Kunde</th>
                  <th>Betrag</th>
                  <th>Zweck</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(request => (
                  <tr key={request.id}>
                    <td>{formatDate(request.created_at)}</td>
                    <td>
                      <div className="user-info">
                        <i className="fas fa-user-circle"></i>
                        {request.user_name || 'N/A'}
                      </div>
                    </td>
                    <td className="amount">{formatCurrency(request.loan_amount)}</td>
                    <td>{request.loan_purpose}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/admin/loan-requests/${request.id}`} 
                          className="btn-icon" 
                          title="Details anzeigen"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        {request.status === 'pending' && (
                          <button className="btn-icon success" title="Genehmigen">
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Keine aktuellen Anfragen</p>
          </div>
        )}
      </div>

      {/* Activity Chart Placeholder */}
      <div className="chart-section">
        <h2>Aktivitätsübersicht</h2>
        <div className="chart-placeholder">
          <i className="fas fa-chart-area"></i>
          <p>Diagramm wird geladen...</p>
          <small>Implementierung mit Chart.js oder Recharts</small>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// Made with Bob
