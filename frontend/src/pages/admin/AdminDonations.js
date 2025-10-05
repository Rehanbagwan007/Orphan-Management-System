"use client"

import { useState, useEffect } from "react"
import { useDonations } from "../../hooks/useDonations"

const AdminDonations = () => {
  const { adminDonations, isLoading, error, getAdminDonations, updateStatus, clearError } = useDonations()
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    adminNotes: "",
  })

  useEffect(() => {
    getAdminDonations()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleStatusUpdate = (donation) => {
    setSelectedDonation(donation)
    setStatusUpdate({
      status: donation.status,
      adminNotes: donation.adminNotes || "",
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedDonation(null)
    clearError()
  }

  const handleSubmitStatusUpdate = async (e) => {
    e.preventDefault()

    try {
      await updateStatus(selectedDonation._id, statusUpdate.status, statusUpdate.adminNotes)
      handleCloseModal()
      // Refresh donations list
      getAdminDonations()
    } catch (error) {
      console.error("Error updating donation status:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
      received: "#17a2b8",
    }
    return colors[status] || "#6c757d"
  }

  if (isLoading && adminDonations.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-donations">
      <div className="admin-section-header">
        <h2>Donation Management</h2>
        <p>Review and manage all donations from users</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {adminDonations.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">💝</div>
          <h3>No Donations Yet</h3>
          <p>Donations from users will appear here for review and management.</p>
        </div>
      ) : (
        <div className="donations-table">
          <div className="table-header">
            <div className="table-row">
              <div className="table-cell">Donor</div>
              <div className="table-cell">Type</div>
              <div className="table-cell">Details</div>
              <div className="table-cell">Date</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
          </div>
          <div className="table-body">
            {adminDonations.map((donation) => (
              <div key={donation._id} className="table-row">
                <div className="table-cell">
                  <div className="donor-info">
                    <div className="donor-name">{donation.donorId?.name}</div>
                    <div className="donor-email">{donation.donorId?.email}</div>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="donation-type">{donation.type === "money" ? "💰 Money" : "🎁 Item"}</div>
                </div>
                <div className="table-cell">
                  <div className="donation-details">
                    {donation.type === "money" ? (
                      <div>
                        <strong>
                          ${donation.amount} {donation.currency}
                        </strong>
                      </div>
                    ) : (
                      <div>
                        <strong>{donation.itemName}</strong>
                        {donation.itemValue > 0 && <div className="item-value">Est. ${donation.itemValue}</div>}
                      </div>
                    )}
                    {donation.message && <div className="donation-message">"{donation.message}"</div>}
                  </div>
                </div>
                <div className="table-cell">
                  <div className="donation-date">{formatDate(donation.createdAt)}</div>
                </div>
                <div className="table-cell">
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(donation.status) }}>
                    {donation.status}
                  </span>
                </div>
                <div className="table-cell">
                  <button className="btn btn-sm btn-primary" onClick={() => handleStatusUpdate(donation)}>
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showModal && selectedDonation && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Donation Status</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="donation-summary">
              <h3>Donation Details</h3>
              <p>
                <strong>Donor:</strong> {selectedDonation.donorId?.name}
              </p>
              <p>
                <strong>Type:</strong> {selectedDonation.type}
              </p>
              {selectedDonation.type === "money" ? (
                <p>
                  <strong>Amount:</strong> ${selectedDonation.amount} {selectedDonation.currency}
                </p>
              ) : (
                <p>
                  <strong>Item:</strong> {selectedDonation.itemName}
                </p>
              )}
              {selectedDonation.message && (
                <p>
                  <strong>Message:</strong> "{selectedDonation.message}"
                </p>
              )}
            </div>

            <form onSubmit={handleSubmitStatusUpdate} className="status-form">
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate((prev) => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="received">Received</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="adminNotes">Admin Notes</label>
                <textarea
                  id="adminNotes"
                  value={statusUpdate.adminNotes}
                  onChange={(e) => setStatusUpdate((prev) => ({ ...prev, adminNotes: e.target.value }))}
                  rows="4"
                  placeholder="Add notes about this donation..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDonations
