"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import FileUpload from "../components/FileUpload"
import FilePreview from "../components/FilePreview"

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDocumentModal, setShowDocumentModal] = useState(false)
    const [tokenOP, setToken] = useState(localStorage.getItem("token"))

  const { user, token, API_BASE_URL } = useAuth()

 

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
   
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        })
        setDocuments(data.documents || [])
      } else {
        setError("Failed to fetch profile")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Profile updated successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/documents/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== documentId))
        setSuccess("Document deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError("Failed to delete document")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and documents</p>
        </div>

        <div className="profile-grid">
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" value={profile.email} disabled />
                <small className="form-text">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  value={profile.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your address"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="documents-section">
            <div className="section-header">
              <h2>My Documents</h2>
              <button className="btn btn-primary" onClick={() => setShowDocumentModal(true)}>
                Upload Document
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No Documents</h3>
                <p>Upload your documents to support adoption applications</p>
                <button className="btn btn-primary" onClick={() => setShowDocumentModal(true)}>
                  Upload First Document
                </button>
              </div>
            ) : (
              <div className="documents-list">
                {documents.map((document) => (
                  <div key={document._id} className="document-item">
                    <div className="document-info">
                      <div className="document-icon">📄</div>
                      <div>
                        <h4>{document.name}</h4>
                        <p className="document-type">{document.type.replace("_", " ")}</p>
                        <p className="document-date">Uploaded: {formatDate(document.uploadDate)}</p>
                      </div>
                    </div>
                    <div className="document-actions">
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-secondary"
                      >
                        View
                      </a>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteDocument(document._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showDocumentModal && (
          <DocumentUploadModal
            onClose={() => setShowDocumentModal(false)}
            onSuccess={(newDocument) => {
              setDocuments([...documents, newDocument])
              setShowDocumentModal(false)
              setSuccess("Document uploaded successfully")
              setTimeout(() => setSuccess(""), 3000)
            }}
          />
        )}
      </div>
    </div>
  )
}

const DocumentUploadModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "income_certificate",
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { token, API_BASE_URL } = useAuth()

  const documentTypes = [
    { value: "income_certificate", label: "Income Certificate" },
    { value: "id_proof", label: "ID Proof" },
    { value: "marriage_certificate", label: "Marriage Certificate" },
    { value: "employment_letter", label: "Employment Letter" },
    { value: "bank_statement", label: "Bank Statement" },
    { value: "other", label: "Other" },
  ]

  const handleFileUpload = (file) => {
    setUploadedFile(file)
    setError("")
    // Auto-fill document name if not provided
    if (!formData.name && file.originalName) {
      setFormData((prev) => ({ ...prev, name: file.originalName }))
    }
  }

  const handleFileUploadError = (errorMessage) => {
    setError(errorMessage)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!uploadedFile) {
      setError("Please upload a file first")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/users/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          url: uploadedFile.url,
          publicId: uploadedFile.publicId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess(data.document)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Upload Document</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Document Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Income Certificate 2024"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Document Type *</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Document *</label>
              <FileUpload
                onUploadSuccess={handleFileUpload}
                onUploadError={handleFileUploadError}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple={false}
              />
              {uploadedFile && (
                <FilePreview files={[uploadedFile]} onDelete={() => setUploadedFile(null)} editable={true} />
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || !uploadedFile}>
                {loading ? "Uploading..." : "Save Document"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
