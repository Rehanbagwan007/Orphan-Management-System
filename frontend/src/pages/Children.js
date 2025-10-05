"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

const Children = () => {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedChild, setSelectedChild] = useState(null)
  const [showAdoptionModal, setShowAdoptionModal] = useState(false)

  const { token, API_BASE_URL } = useAuth()

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/children/available`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChildren(data)
      } else {
        setError("Failed to fetch children")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAdoptionRequest = (child) => {
    setSelectedChild(child)
    setShowAdoptionModal(true)
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
      <div className="children-page">
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="children-page">
      <div className="container">
        <div className="page-header">
          <h1>Children Available for Adoption</h1>
          <p>Meet the wonderful children looking for loving homes</p>
        </div>

        {children.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👶</div>
            <h3>No Children Available</h3>
            <p>There are currently no children available for adoption. Please check back later.</p>
          </div>
        ) : (
          <div className="children-grid">
            {children.map((child) => (
              <ChildCard key={child._id} child={child} onAdoptionRequest={handleAdoptionRequest} />
            ))}
          </div>
        )}

        {showAdoptionModal && (
          <AdoptionModal
            child={selectedChild}
            onClose={() => {
              setShowAdoptionModal(false)
              setSelectedChild(null)
            }}
            onSuccess={() => {
              setShowAdoptionModal(false)
              setSelectedChild(null)
              fetchChildren() // Refresh the list
            }}
          />
        )}
      </div>
    </div>
  )
}

const ChildCard = ({ child, onAdoptionRequest }) => {
  const getAgeText = (age) => {
    return age === 1 ? "1 year old" : `${age} years old`
  }

  const getHealthStatusColor = (status) => {
    const colors = {
      excellent: "#28a745",
      good: "#17a2b8",
      fair: "#ffc107",
      needs_attention: "#dc3545",
    }
    return colors[status] || "#6c757d"
  }

  return (
    <div className="child-card">
      <div className="child-photo">
        <img src={child.photo || "/placeholder.svg?height=200&width=300&query=happy child portrait"} alt={child.name} />
        <div className="child-status">
          <span className="status-badge" style={{ backgroundColor: getHealthStatusColor(child.health?.status) }}>
            {child.health?.status?.replace("_", " ") || "Good"}
          </span>
        </div>
      </div>

      <div className="child-info">
        <div className="child-header">
          <h3>{child.name}</h3>
          <div className="child-details">
            <span className="age">{getAgeText(child.age)}</span>
            <span className="gender">{child.gender}</span>
          </div>
        </div>

        {child.description && <p className="child-description">{child.description}</p>}

        <div className="child-attributes">
          {child.education?.level && child.education.level !== "none" && (
            <div className="attribute">
              <span className="attribute-label">Education:</span>
              <span className="attribute-value">{child.education.level.replace("_", " ")}</span>
            </div>
          )}

          {child.interests && child.interests.length > 0 && (
            <div className="attribute">
              <span className="attribute-label">Interests:</span>
              <span className="attribute-value">{child.interests.join(", ")}</span>
            </div>
          )}
        </div>

        <div className="child-actions">
          <button className="btn btn-primary btn-full" onClick={() => onAdoptionRequest(child)}>
            Apply for Adoption
          </button>
        </div>
      </div>
    </div>
  )
}

const AdoptionModal = ({ child, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    reason: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { token, API_BASE_URL } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/adoptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          childId: child._id,
          reason: formData.reason,
        }),
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
          <h3>Apply for Adoption</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="adoption-child-info">
            <img
              src={child.photo || "/placeholder.svg?height=80&width=80&query=child portrait"}
              alt={child.name}
              className="adoption-child-photo"
            />
            <div>
              <h4>{child.name}</h4>
              <p>
                {child.age} years old • {child.gender}
              </p>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Why do you want to adopt {child.name}? *</label>
              <textarea
                className="form-control"
                rows="4"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please share your motivation and how you plan to provide a loving home..."
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Children
