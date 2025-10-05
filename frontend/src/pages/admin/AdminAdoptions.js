"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

const AdminAdoptions = () => {
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedAdoption, setSelectedAdoption] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)

  const { token, API_BASE_URL } = useAuth()

  useEffect(() => {
    fetchAdoptions()
  }, [])

  const fetchAdoptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setAdoptions(data)
      } else {
        setError("Failed to fetch adoption requests")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (adoption) => {
    setSelectedAdoption(adoption)
    setShowReviewModal(true)
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
    <div className="admin-adoptions">
      <div className="admin-section-header">
        <h2>Adoption Requests</h2>
        <div className="status-filters">
          <span className="filter-label">Filter by status:</span>
          <button className="btn btn-sm btn-secondary">All</button>
          <button className="btn btn-sm" style={{ backgroundColor: "#ffc107", color: "white" }}>
            Pending
          </button>
          <button className="btn btn-sm" style={{ backgroundColor: "#28a745", color: "white" }}>
            Approved
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {adoptions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Adoption Requests</h3>
          <p>No adoption requests have been submitted yet.</p>
        </div>
      ) : (
        <div className="adoptions-list">
          {adoptions.map((adoption) => (
            <div key={adoption._id} className="adoption-card">
              <div className="adoption-header">
                <div className="adoption-info">
                  <div className="applicant-info">
                    <h4>{adoption.userId?.name}</h4>
                    <p>{adoption.userId?.email}</p>
                    <p>{adoption.userId?.phone}</p>
                  </div>
                  <div className="child-info">
                    <img
                      src={adoption.childId?.photo || "/placeholder.svg?height=60&width=60&query=child portrait"}
                      alt={adoption.childId?.name}
                      className="child-thumbnail"
                    />
                    <div>
                      <h4>{adoption.childId?.name}</h4>
                      <p>
                        {adoption.childId?.age} years old • {adoption.childId?.gender}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="adoption-status">
                  <span className="status-badge large" style={{ backgroundColor: getStatusColor(adoption.status) }}>
                    {adoption.status}
                  </span>
                  <div className="adoption-date">Applied: {formatDate(adoption.createdAt)}</div>
                </div>
              </div>

              <div className="adoption-body">
                <div className="adoption-reason">
                  <h5>Application Message:</h5>
                  <p>{adoption.reason}</p>
                </div>

                {adoption.adminNotes && (
                  <div className="admin-notes">
                    <h5>Admin Notes:</h5>
                    <p>{adoption.adminNotes}</p>
                  </div>
                )}

                <div className="adoption-actions">
                  <button className="btn btn-primary" onClick={() => handleReview(adoption)}>
                    Review Application
                  </button>
                  {adoption.status === "pending" && (
                    <>
                      <button className="btn btn-success" onClick={() => handleReview(adoption)}>
                        Approve
                      </button>
                      <button className="btn btn-danger" onClick={() => handleReview(adoption)}>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReviewModal && selectedAdoption && (
        <ReviewModal
          adoption={selectedAdoption}
          onClose={() => {
            setShowReviewModal(false)
            setSelectedAdoption(null)
          }}
          onSuccess={() => {
            setShowReviewModal(false)
            setSelectedAdoption(null)
            fetchAdoptions()
          }}
        />
      )}
    </div>
  )
}

const ReviewModal = ({ adoption, onClose, onSuccess }) => {
  const [status, setStatus] = useState(adoption.status)
  const [adminNotes, setAdminNotes] = useState(adoption.adminNotes || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { token, API_BASE_URL } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/${adoption._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
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
          <h3>Review Adoption Application</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="review-summary">
            <div className="applicant-summary">
              <h4>Applicant: {adoption.userId?.name}</h4>
              <p>Email: {adoption.userId?.email}</p>
              <p>Phone: {adoption.userId?.phone}</p>
            </div>
            <div className="child-summary">
              <h4>Child: {adoption.childId?.name}</h4>
              <p>
                {adoption.childId?.age} years old • {adoption.childId?.gender}
              </p>
            </div>
          </div>

          <div className="application-message">
            <h5>Application Message:</h5>
            <p>{adoption.reason}</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Status *</label>
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Notes</label>
              <textarea
                className="form-control"
                rows="4"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about your decision..."
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminAdoptions
