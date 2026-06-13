import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LoanHistory.css';

const LoanHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'date_desc'
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, filters]);

  const fetchLoanRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/loans/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      approved: data.filter(r => r.status === 'approved').length,
      rejected: data.filter(r => r.status === 'rejected').length,
      totalAmount: data.reduce((sum, r) => sum + parseFloat(r.loan_amount), 0)
    });
  };

  const applyFilters = () => {
    let filtered = [...requests];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    // Filter by date range
    const now = new Date();
    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(r => {
        const requestDate = new Date(r.created_at);
        const diffTime = Math.abs(now - requestDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case '7days':
            return diffDays <= 7;
          case '30days':
            return diffDays <= 30;
          case '90days':
            return diffDays <= 90;
          case '1year':
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_desc':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'date_asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'amount_desc':
          return parseFloat(b.loan_amount) - parseFloat(a.loan_amount);
        case 'amount_asc':
          return parseFloat(a.loan_amount) - parseFloat(b.loan_amount);
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'In Bearbeitung', class: 'status-pending', icon: 'fa-clock' },
      approved: { text: 'Genehmigt', class: 'status-approved', icon: 'fa-check-circle' },
      rejected: { text: 'Abgelehnt', class: 'status-rejected', icon: 'fa-times-circle' },
      in_review: { text: 'Wird geprüft', class: 'status-review', icon: 'fa-search' }
    };
    
    const badge = badges[status] || { text: status, class: 'status-default', icon: 'fa-info-circle' };
    return (
      <span className={`status-badge ${badge.class}`}>
        <i className={`fas ${badge.icon}`}></i>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMonthlyPayment = (amount, duration, rate = 4.5) => {
    const monthlyRate = rate / 100 / 12;
    const months = duration;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return formatCurrency(payment);
  };

  if (loading) {
    return (
      <div className="loan-history">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-history">
      <div className="page-header">
        <div className="header-content">
          <Link to="/user/dashboard" className="back-link">
            <i className="fas fa-arrow-left"></i>
            Zurück zum Dashboard
          </Link>
          <h1>Kreditverlauf</h1>
          <p className="header-subtitle">Alle Ihre Kreditanfragen im Überblick</p>
        </div>
        <Link to="/loan-simulator" className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Neue Anfrage
        </Link>
      </div>

      {/* Statistics Summary */}
      <div className="stats-summary">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Gesamte Anfragen</div>
        </div>
        <div className="stat-item">
          <div className="stat-value pending">{stats.pending}</div>
          <div className="stat-label">In Bearbeitung</div>
        </div>
        <div className="stat-item">
          <div className="stat-value approved">{stats.approved}</div>
          <div className="stat-label">Genehmigt</div>
        </div>
        <div className="stat-item">
          <div className="stat-value rejected">{stats.rejected}</div>
          <div className="stat-label">Abgelehnt</div>
        </div>
        <div className="stat-item">
          <div className="stat-value amount">{formatCurrency(stats.totalAmount)}</div>
          <div className="stat-label">Gesamtbetrag</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">Alle Status</option>
            <option value="pending">In Bearbeitung</option>
            <option value="approved">Genehmigt</option>
            <option value="rejected">Abgelehnt</option>
            <option value="in_review">Wird geprüft</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Zeitraum:</label>
          <select 
            value={filters.dateRange} 
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">Alle Zeiträume</option>
            <option value="7days">Letzte 7 Tage</option>
            <option value="30days">Letzte 30 Tage</option>
            <option value="90days">Letzte 90 Tage</option>
            <option value="1year">Letztes Jahr</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sortieren nach:</label>
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="date_desc">Neueste zuerst</option>
            <option value="date_asc">Älteste zuerst</option>
            <option value="amount_desc">Höchster Betrag</option>
            <option value="amount_asc">Niedrigster Betrag</option>
          </select>
        </div>

        <div className="results-count">
          {filteredRequests.length} {filteredRequests.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="requests-list">
          {filteredRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <h3>{request.loan_purpose}</h3>
                  <p className="request-date">
                    <i className="far fa-calendar"></i>
                    Eingereicht am {formatDate(request.created_at)}
                  </p>
                </div>
                {getStatusBadge(request.status)}
              </div>

              <div className="request-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Kreditbetrag:</span>
                    <span className="detail-value amount">{formatCurrency(request.loan_amount)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Laufzeit:</span>
                    <span className="detail-value">{request.loan_duration} Monate</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Monatliche Rate:</span>
                    <span className="detail-value">{getMonthlyPayment(request.loan_amount, request.loan_duration)}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Partner:</span>
                    <span className="detail-value">{request.partner_name || 'Alle Partner'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Monatliches Einkommen:</span>
                    <span className="detail-value">{formatCurrency(request.monthly_income)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Beschäftigungsart:</span>
                    <span className="detail-value">
                      {request.employment_type === 'permanent' ? 'Unbefristet' :
                       request.employment_type === 'temporary' ? 'Befristet' :
                       request.employment_type === 'self_employed' ? 'Selbstständig' :
                       request.employment_type}
                    </span>
                  </div>
                </div>
              </div>

              {request.admin_notes && (
                <div className="admin-notes">
                  <i className="fas fa-comment-alt"></i>
                  <strong>Anmerkung:</strong> {request.admin_notes}
                </div>
              )}

              <div className="request-actions">
                <Link to={`/user/loan-history/${request.id}`} className="btn btn-secondary">
                  <i className="fas fa-eye"></i>
                  Details anzeigen
                </Link>
                {request.status === 'pending' && (
                  <button className="btn btn-outline">
                    <i className="fas fa-edit"></i>
                    Bearbeiten
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <h3>Keine Anfragen gefunden</h3>
          <p>Mit den aktuellen Filtern wurden keine Kreditanfragen gefunden.</p>
          <button 
            onClick={() => setFilters({ status: 'all', dateRange: 'all', sortBy: 'date_desc' })}
            className="btn btn-secondary"
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
};

export default LoanHistory;

// Made with Bob
