"use client"

import { useState, useEffect } from "react"
import { useDonations } from "../hooks/useDonations"
import { useAuth } from "../hooks/useAuth"

const Donations = () => {
  const { donations, isLoading, error, getDonations, addDonation, clearError } = useDonations()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [donationType, setDonationType] = useState("")
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    itemName: "",
    itemDescription: "",
    itemValue: "",
    message: "",
  })

  useEffect(() => {
    getDonations()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleOpenModal = (type) => {
    setDonationType(type)
    setShowModal(true)
    setFormData({
      amount: "",
      currency: "USD",
      itemName: "",
      itemDescription: "",
      itemValue: "",
      message: "",
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setDonationType("")
    clearError()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const donationData = {
      type: donationType,
      message: formData.message,
    }

    if (donationType === "money") {
      donationData.amount = Number.parseFloat(formData.amount)
      donationData.currency = formData.currency
    } else {
      donationData.itemName = formData.itemName
      donationData.itemDescription = formData.itemDescription
      donationData.itemValue = formData.itemValue ? Number.parseFloat(formData.itemValue) : 0
    }

    try {
      await addDonation(donationData)
      handleCloseModal()
      // Refresh donations list
      getDonations()
    } catch (error) {
      console.error("Error creating donation:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  if (isLoading && donations.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="donations-page">
      <div className="container">
        <div className="page-header">
          <h1>Make a Donation</h1>
          <p>Support our mission to provide care and find homes for children</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="donation-options">
          <div className="donation-card">
            <div className="donation-icon">💰</div>
            <h3>Monetary Donation</h3>
            <p>Make a financial contribution to support our operations</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal("money")}>
              Donate Money
            </button>
          </div>

          <div className="donation-card">
            <div className="donation-icon">🎁</div>
            <h3>Item Donation</h3>
            <p>Donate clothes, toys, books, or other essential items</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal("item")}>
              Donate Items
            </button>
          </div>
        </div>

        {donations.length > 0 && (
          <div className="my-donations">
            <h2>My Donations</h2>
            <div className="donations-list">
              {donations.map((donation) => (
                <div key={donation._id} className="donation-item">
                  <div className="donation-info">
                    <div className="donation-type">
                      {donation.type === "money" ? "💰" : "🎁"}
                      {donation.type === "money" ? `$${donation.amount} ${donation.currency}` : donation.itemName}
                    </div>
                    <div className="donation-date">{formatDate(donation.createdAt)}</div>
                    {donation.message && <div className="donation-message">"{donation.message}"</div>}
                    {donation.adminNotes && (
                      <div className="admin-notes">
                        <strong>Admin Notes:</strong> {donation.adminNotes}
                      </div>
                    )}
                  </div>
                  <div className="donation-status">
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(donation.status) }}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{donationType === "money" ? "💰 Monetary Donation" : "🎁 Item Donation"}</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="donation-form">
                {donationType === "money" ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="amount">Amount *</label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="currency">Currency</label>
                      <select id="currency" name="currency" value={formData.currency} onChange={handleInputChange}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="itemName">Item Name *</label>
                      <input
                        type="text"
                        id="itemName"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="itemDescription">Description</label>
                      <textarea
                        id="itemDescription"
                        name="itemDescription"
                        value={formData.itemDescription}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="itemValue">Estimated Value ($)</label>
                      <input
                        type="number"
                        id="itemValue"
                        name="itemValue"
                        value={formData.itemValue}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="message">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Leave a message with your donation..."
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Submit Donation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Donations
