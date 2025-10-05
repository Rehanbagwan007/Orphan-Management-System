"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalChildren: 0,
    availableChildren: 0,
    adoptedChildren: 0,
    pendingAdoptions: 0,
    totalUsers: 0,
    totalDonations: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const { token, API_BASE_URL } = useAuth()

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      // Fetch all children
      const childrenResponse = await fetch(`${API_BASE_URL}/children`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (childrenResponse.ok) {
        const children = await childrenResponse.json()
        setStats((prev) => ({
          ...prev,
          totalChildren: children.length,
          availableChildren: children.filter((c) => c.adoptionStatus === "available").length,
          adoptedChildren: children.filter((c) => c.adoptionStatus === "adopted").length,
        }))
      }

      // Fetch adoption requests
      const adoptionsResponse = await fetch(`${API_BASE_URL}/adoptions`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (adoptionsResponse.ok) {
        const adoptions = await adoptionsResponse.json()
        setStats((prev) => ({
          ...prev,
          pendingAdoptions: adoptions.filter((a) => a.status === "pending").length,
        }))

        // Set recent activity from adoptions
        setRecentActivity(adoptions.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching overview data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
      completed: "#17a2b8",
    }
    return colors[status] || "#6c757d"
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👶</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalChildren}</div>
            <div className="stat-label">Total Children</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <div className="stat-number">{stats.availableChildren}</div>
            <div className="stat-label">Available for Adoption</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.adoptedChildren}</div>
            <div className="stat-label">Successfully Adopted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pendingAdoptions}</div>
            <div className="stat-label">Pending Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Registered Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💝</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalDonations}</div>
            <div className="stat-label">Total Donations</div>
          </div>
        </div>
      </div>

      {recentActivity.length > 0 && (
        <div className="recent-activity">
          <h3>Recent Adoption Applications</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p>
                    <strong>{activity.userId?.name}</strong> applied to adopt <strong>{activity.childId?.name}</strong>
                  </p>
                  <div className="activity-meta">
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(activity.status) }}>
                      {activity.status}
                    </span>
                    <span className="activity-time">{formatDate(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOverview
