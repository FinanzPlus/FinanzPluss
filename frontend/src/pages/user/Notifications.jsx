import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/notifications/my-notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    setStats({
      total: notifications.length,
      unread: notifications.filter(n => !n.is_read).length,
      read: notifications.filter(n => n.is_read).length
    });
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        alert('Alle Benachrichtigungen als gelesen markiert');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Fehler beim Markieren der Benachrichtigungen');
    }
  };

  const handleDelete = async (notificationId) => {
    if (!confirm('Möchten Sie diese Benachrichtigung wirklich löschen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Fehler beim Löschen der Benachrichtigung');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Möchten Sie wirklich alle Benachrichtigungen löschen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Delete all notifications one by one
      for (const notification of notifications) {
        await fetch(`http://localhost:5000/api/notifications/${notification.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      setNotifications([]);
      alert('Alle Benachrichtigungen gelöscht');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Fehler beim Löschen der Benachrichtigungen');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: 'fa-check-circle',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle',
      error: 'fa-times-circle'
    };
    return icons[type] || 'fa-bell';
  };

  const getNotificationClass = (type) => {
    return `notification-${type}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `Vor ${diffMinutes} Minute${diffMinutes !== 1 ? 'n' : ''}`;
      }
      return `Vor ${diffHours} Stunde${diffHours !== 1 ? 'n' : ''}`;
    }
    
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `Vor ${diffDays} Tagen`;
    
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.is_read);
    if (filter === 'read') return notifications.filter(n => n.is_read);
    return notifications.filter(n => n.type === filter);
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="header-content">
          <Link to="/user/dashboard" className="back-link">
            <i className="fas fa-arrow-left"></i>
            Zurück zum Dashboard
          </Link>
          <h1>Benachrichtigungen</h1>
          <p className="header-subtitle">Bleiben Sie über alle wichtigen Ereignisse informiert</p>
        </div>
        {stats.unread > 0 && (
          <button onClick={handleMarkAllAsRead} className="btn btn-secondary">
            <i className="fas fa-check-double"></i>
            Alle als gelesen markieren
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="notif-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-bell"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Gesamt</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon unread">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.unread}</h3>
            <p>Ungelesen</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon read">
            <i className="fas fa-envelope-open"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.read}</h3>
            <p>Gelesen</p>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="notif-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Alle ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Ungelesen ({stats.unread})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Gelesen ({stats.read})
          </button>
          <button
            className={`filter-btn ${filter === 'success' ? 'active' : ''}`}
            onClick={() => setFilter('success')}
          >
            <i className="fas fa-check-circle"></i>
            Erfolg
          </button>
          <button
            className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
            onClick={() => setFilter('warning')}
          >
            <i className="fas fa-exclamation-triangle"></i>
            Warnung
          </button>
          <button
            className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
            onClick={() => setFilter('info')}
          >
            <i className="fas fa-info-circle"></i>
            Info
          </button>
        </div>
        {notifications.length > 0 && (
          <button onClick={handleDeleteAll} className="btn btn-outline-danger">
            <i className="fas fa-trash"></i>
            Alle löschen
          </button>
        )}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card ${!notification.is_read ? 'unread' : ''} ${getNotificationClass(notification.type)}`}
            >
              <div className="notification-icon">
                <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-time">{formatDate(notification.created_at)}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                {notification.action_url && (
                  <a href={notification.action_url} className="notification-action">
                    <i className="fas fa-arrow-right"></i>
                    Details anzeigen
                  </a>
                )}
              </div>
              <div className="notification-actions">
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="btn-icon"
                    title="Als gelesen markieren"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="btn-icon delete"
                  title="Löschen"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              {!notification.is_read && <span className="unread-indicator"></span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-bell-slash"></i>
          <h3>Keine Benachrichtigungen</h3>
          <p>
            {filter === 'all' 
              ? 'Sie haben noch keine Benachrichtigungen erhalten.'
              : `Keine ${filter === 'unread' ? 'ungelesenen' : filter === 'read' ? 'gelesenen' : filter} Benachrichtigungen.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;

// Made with Bob
