import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [uploadForm, setUploadForm] = useState({
    document_type: '',
    file: null
  });
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });

  const documentTypes = [
    { value: 'id_card', label: 'Personalausweis' },
    { value: 'passport', label: 'Reisepass' },
    { value: 'income_proof', label: 'Einkommensnachweis' },
    { value: 'employment_contract', label: 'Arbeitsvertrag' },
    { value: 'bank_statement', label: 'Kontoauszug' },
    { value: 'tax_return', label: 'Steuerbescheid' },
    { value: 'residence_permit', label: 'Aufenthaltstitel' },
    { value: 'other', label: 'Sonstiges' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/documents/my-documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    setStats({
      total: documents.length,
      verified: documents.filter(d => d.verification_status === 'verified').length,
      pending: documents.filter(d => d.verification_status === 'pending').length,
      rejected: documents.filter(d => d.verification_status === 'rejected').length
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximale Größe: 10 MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Ungültiger Dateityp. Erlaubt: PDF, JPG, PNG');
        return;
      }
      
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.document_type || !uploadForm.file) {
      alert('Bitte wählen Sie einen Dokumenttyp und eine Datei aus');
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('document', uploadForm.file);
      formData.append('document_type', uploadForm.document_type);
      
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Dokument erfolgreich hochgeladen!');
        setUploadForm({ document_type: '', file: null });
        document.getElementById('file-input').value = '';
        fetchDocuments();
      } else {
        alert(data.error || 'Fehler beim Hochladen');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Fehler beim Hochladen des Dokuments');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm('Möchten Sie dieses Dokument wirklich löschen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Dokument gelöscht');
        fetchDocuments();
      } else {
        alert(data.error || 'Fehler beim Löschen');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Fehler beim Löschen des Dokuments');
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Fehler beim Herunterladen');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Fehler beim Herunterladen des Dokuments');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Wird geprüft', class: 'status-pending', icon: 'fa-clock' },
      verified: { text: 'Verifiziert', class: 'status-verified', icon: 'fa-check-circle' },
      rejected: { text: 'Abgelehnt', class: 'status-rejected', icon: 'fa-times-circle' }
    };
    
    const badge = badges[status] || { text: status, class: 'status-default', icon: 'fa-info-circle' };
    return (
      <span className={`status-badge ${badge.class}`}>
        <i className={`fas ${badge.icon}`}></i>
        {badge.text}
      </span>
    );
  };

  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFilteredDocuments = () => {
    if (filter === 'all') return documents;
    return documents.filter(d => d.verification_status === filter);
  };

  const filteredDocuments = getFilteredDocuments();

  if (loading) {
    return (
      <div className="documents-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <div className="page-header">
        <div className="header-content">
          <Link to="/user/dashboard" className="back-link">
            <i className="fas fa-arrow-left"></i>
            Zurück zum Dashboard
          </Link>
          <h1>Meine Dokumente</h1>
          <p className="header-subtitle">Verwalten Sie Ihre hochgeladenen Dokumente</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="docs-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-file"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Gesamt</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon verified">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.verified}</h3>
            <p>Verifiziert</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>In Prüfung</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rejected">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.rejected}</h3>
            <p>Abgelehnt</p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="upload-section">
        <h2>
          <i className="fas fa-cloud-upload-alt"></i>
          Neues Dokument hochladen
        </h2>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label>Dokumenttyp *</label>
              <select
                value={uploadForm.document_type}
                onChange={(e) => setUploadForm(prev => ({ ...prev, document_type: e.target.value }))}
                required
              >
                <option value="">Bitte wählen...</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Datei auswählen * (Max. 10 MB, PDF/JPG/PNG)</label>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />
              {uploadForm.file && (
                <p className="file-info">
                  <i className="fas fa-file"></i>
                  {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
                </p>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Wird hochgeladen...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i>
                Hochladen
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle ({documents.length})
        </button>
        <button
          className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
          onClick={() => setFilter('verified')}
        >
          Verifiziert ({stats.verified})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          In Prüfung ({stats.pending})
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Abgelehnt ({stats.rejected})
        </button>
      </div>

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="documents-grid">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="document-card">
              <div className="document-icon">
                <i className={`fas ${doc.file_path.endsWith('.pdf') ? 'fa-file-pdf' : 'fa-file-image'}`}></i>
              </div>
              <div className="document-info">
                <h3>{getDocumentTypeLabel(doc.document_type)}</h3>
                <p className="document-filename">{doc.file_name}</p>
                <p className="document-meta">
                  <span><i className="far fa-calendar"></i> {formatDate(doc.uploaded_at)}</span>
                  <span><i className="fas fa-hdd"></i> {formatFileSize(doc.file_size)}</span>
                </p>
                {getStatusBadge(doc.verification_status)}
                {doc.rejection_reason && (
                  <div className="rejection-reason">
                    <i className="fas fa-exclamation-triangle"></i>
                    <strong>Grund:</strong> {doc.rejection_reason}
                  </div>
                )}
              </div>
              <div className="document-actions">
                <button
                  onClick={() => handleDownload(doc.id, doc.file_name)}
                  className="btn-icon"
                  title="Herunterladen"
                >
                  <i className="fas fa-download"></i>
                </button>
                {doc.verification_status === 'pending' && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn-icon delete"
                    title="Löschen"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>Keine Dokumente gefunden</h3>
          <p>
            {filter === 'all' 
              ? 'Sie haben noch keine Dokumente hochgeladen.'
              : `Keine Dokumente mit dem Status "${filter === 'verified' ? 'Verifiziert' : filter === 'pending' ? 'In Prüfung' : 'Abgelehnt'}".`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Documents;

// Made with Bob
