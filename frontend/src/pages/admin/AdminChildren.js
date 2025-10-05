"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

const AdminChildren = () => {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingChild, setEditingChild] = useState(null)

  const { token, API_BASE_URL } = useAuth()

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/children`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleDelete = async (childId) => {
    if (!window.confirm("Are you sure you want to delete this child record?")) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/children/${childId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setChildren(children.filter((child) => child._id !== childId))
      } else {
        setError("Failed to delete child")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      available: "#28a745",
      pending: "#ffc107",
      adopted: "#17a2b8",
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
    <div className="admin-children">
      <div className="admin-section-header">
        <h2>Children Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          Add New Child
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {children.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👶</div>
          <h3>No Children Records</h3>
          <p>Start by adding the first child to the system.</p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add First Child
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Health Status</th>
                <th>Adoption Status</th>
                <th>Added Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child._id}>
                  <td>
                    <img
                      src={child.photo || "/placeholder.svg?height=40&width=40&query=child portrait"}
                      alt={child.name}
                      className="table-photo"
                    />
                  </td>
                  <td className="font-weight-bold">{child.name}</td>
                  <td>{child.age} years</td>
                  <td className="text-capitalize">{child.gender}</td>
                  <td>
                    <span className="health-status">{child.health?.status?.replace("_", " ") || "Good"}</span>
                  </td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(child.adoptionStatus) }}>
                      {child.adoptionStatus}
                    </span>
                  </td>
                  <td>{formatDate(child.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingChild(child)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(child._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAddModal || editingChild) && (
        <ChildModal
          child={editingChild}
          onClose={() => {
            setShowAddModal(false)
            setEditingChild(null)
          }}
          onSuccess={() => {
            setShowAddModal(false)
            setEditingChild(null)
            fetchChildren()
          }}
        />
      )}
    </div>
  )
}

const ChildModal = ({ child, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: child?.name || "",
    age: child?.age || "",
    gender: child?.gender || "male",
    photo: child?.photo || "",
    description: child?.description || "",
    health: {
      status: child?.health?.status || "good",
      conditions: child?.health?.conditions?.join(", ") || "",
      lastCheckup: child?.health?.lastCheckup ? new Date(child.health.lastCheckup).toISOString().split("T")[0] : "",
    },
    education: {
      level: child?.education?.level || "none",
      school: child?.education?.school || "",
      grade: child?.education?.grade || "",
    },
    interests: child?.interests?.join(", ") || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { token, API_BASE_URL } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const submitData = {
        ...formData,
        age: Number.parseInt(formData.age),
        health: {
          ...formData.health,
          conditions: formData.health.conditions
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c),
          lastCheckup: formData.health.lastCheckup || undefined,
        },
        interests: formData.interests
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
      }

      const url = child ? `${API_BASE_URL}/children/${child._id}` : `${API_BASE_URL}/children`

      const method = child ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          //"Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
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

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{child ? "Edit Child" : "Add New Child"}</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="18"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Health Status</label>
                <select
                  name="health.status"
                  className="form-control"
                  value={formData.health.status}
                  onChange={handleChange}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs_attention">Needs Attention</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL</label>
              <input
                type="file"
                name="photo"
                className="form-control"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description about the child..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Education Level</label>
                <select
                  name="education.level"
                  className="form-control"
                  value={formData.education.level}
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="high_school">High School</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">School</label>
                <input
                  type="text"
                  name="education.school"
                  className="form-control"
                  value={formData.education.school}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Health Conditions</label>
                <input
                  type="text"
                  name="health.conditions"
                  className="form-control"
                  value={formData.health.conditions}
                  onChange={handleChange}
                  placeholder="Separate multiple conditions with commas"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Checkup</label>
                <input
                  type="date"
                  name="health.lastCheckup"
                  className="form-control"
                  value={formData.health.lastCheckup}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Interests</label>
              <input
                type="text"
                name="interests"
                className="form-control"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Separate multiple interests with commas"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : child ? "Update Child" : "Add Child"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminChildren
