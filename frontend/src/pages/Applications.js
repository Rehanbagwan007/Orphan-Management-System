"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const { token, API_BASE_URL } = useAuth()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      } else {
        setError("Failed to fetch applications")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      approved: "#28a745",
      rejected: "#dc3545",
      completed: "#17a2b8",
    }
    return colors[status] || "#6c757d"
  }

  const getStatusText = (status) => {
    const texts = {
      pending: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
      completed: "Completed",
    }
    return texts[status] || status
  }

  const getStatusDescription = (status) => {
    const descriptions = {
      pending: "Your application is being reviewed by our team.",
      approved: "Congratulations! Your application has been approved. Please contact us for next steps.",
      rejected: "Unfortunately, your application was not approved at this time.",
      completed: "The adoption process has been completed successfully.",
    }
    return descriptions[status] || ""
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    setShowDetailsModal(true)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="applications-page">
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="applications-page">
      <div className="container">
        <div className="page-header">
          <h1>My Adoption Applications</h1>
          <p>Track the status of your adoption applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Applications Yet</h3>
            <p>You haven't submitted any adoption applications yet.</p>
            <div className="empty-actions">
              <Link to="/children" className="btn btn-primary">
                Browse Children
              </Link>
              <Link to="/profile" className="btn btn-secondary">
                Complete Profile
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="applications-summary">
              <div className="summary-stats">
                <div className="summary-stat">
                  <div className="stat-number">{applications.length}</div>
                  <div className="stat-label">Total Applications</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-number">{applications.filter((app) => app.status === "pending").length}</div>
                  <div className="stat-label">Pending Review</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-number">{applications.filter((app) => app.status === "approved").length}</div>
                  <div className="stat-label">Approved</div>
                </div>
              </div>
            </div>

            <div className="applications-list">
              {applications.map((application) => (
                <div key={application._id} className="application-card enhanced">
                  <div className="application-header">
                    <div className="child-info">
                      <img
                        src={application.childId?.photo || "/placeholder.svg?height=80&width=80&query=child portrait"}
                        alt={application.childId?.name}
                        className="child-photo-large"
                      />
                      <div className="child-details">
                        <h3>{application.childId?.name}</h3>
                        <p className="child-age-gender">
                          {application.childId?.age} years old • {application.childId?.gender}
                        </p>
                        <p className="child-description">
                          {application.childId?.description || "No description available"}
                        </p>
                      </div>
                    </div>
                    <div className="application-status">
                      <span
                        className="status-badge large"
                        style={{ backgroundColor: getStatusColor(application.status) }}
                      >
                        {getStatusText(application.status)}
                      </span>
                      <p className="status-description">{getStatusDescription(application.status)}</p>
                    </div>
                  </div>

                  <div className="application-body">
                    <div className="application-timeline">
                      <div className="timeline-item">
                        <div className="timeline-icon">📝</div>
                        <div className="timeline-content">
                          <h4>Application Submitted</h4>
                          <p>{formatDate(application.createdAt)}</p>
                        </div>
                      </div>

                      {application.reviewedAt && (
                        <div className="timeline-item">
                          <div className="timeline-icon">
                            {application.status === "approved" ? "✅" : application.status === "rejected" ? "❌" : "👀"}
                          </div>
                          <div className="timeline-content">
                            <h4>Application Reviewed</h4>
                            <p>{formatDate(application.reviewedAt)}</p>
                            {application.reviewedBy && <p className="reviewer">Reviewed by admin</p>}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="application-actions">
                      <button className="btn btn-primary" onClick={() => handleViewDetails(application)}>
                        View Details
                      </button>
                      {application.status === "approved" && <button className="btn btn-success">Contact Admin</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showDetailsModal && selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedApplication(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

const ApplicationDetailsModal = ({ application, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      approved: "#28a745",
      rejected: "#dc3545",
      completed: "#17a2b8",
    }
    return colors[status] || "#6c757d"
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Application Details</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="application-details">
            <div className="details-section">
              <h4>Child Information</h4>
              <div className="child-summary">
                <img
                  src={application.childId?.photo || "/placeholder.svg?height=100&width=100&query=child portrait"}
                  alt={application.childId?.name}
                  className="child-photo-modal"
                />
                <div>
                  <h3>{application.childId?.name}</h3>
                  <p>
                    {application.childId?.age} years old • {application.childId?.gender}
                  </p>
                  <p>{application.childId?.description}</p>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h4>Application Status</h4>
              <div className="status-info">
                <span className="status-badge large" style={{ backgroundColor: getStatusColor(application.status) }}>
                  {application.status}
                </span>
                <div className="status-dates">
                  <p>
                    <strong>Submitted:</strong> {formatDate(application.createdAt)}
                  </p>
                  {application.reviewedAt && (
                    <p>
                      <strong>Reviewed:</strong> {formatDate(application.reviewedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="details-section">
              <h4>Your Message</h4>
              <div className="message-content">
                <p>{application.reason}</p>
              </div>
            </div>

            {application.adminNotes && (
              <div className="details-section">
                <h4>Admin Notes</h4>
                <div className="admin-notes-content">
                  <p>{application.adminNotes}</p>
                </div>
              </div>
            )}

            {application.documents && application.documents.length > 0 && (
              <div className="details-section">
                <h4>Submitted Documents</h4>
                <div className="documents-list">
                  {application.documents.map((doc, index) => (
                    <div key={index} className="document-item">
                      <div className="document-icon">📄</div>
                      <div>
                        <h5>{doc.name}</h5>
                        <p>{doc.type.replace("_", " ")}</p>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            {application.status === "approved" && (
              <button className="btn btn-success">Contact Admin for Next Steps</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Applications
