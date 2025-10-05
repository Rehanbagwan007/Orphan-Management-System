"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const { user, token, API_BASE_URL } = useAuth()
  const [stats, setStats] = useState({
    adoptionRequests: 0,
    donations: 0,
    availableChildren: 0,
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's adoption requests
      const adoptionResponse = await fetch(`${API_BASE_URL}/adoptions/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (adoptionResponse.ok) {
        const adoptionData = await adoptionResponse.json()
        setRecentRequests(adoptionData.slice(0, 3)) // Show only recent 3
        setStats((prev) => ({ ...prev, adoptionRequests: adoptionData.length }))
      }

      // Fetch available children count
      const childrenResponse = await fetch(`${API_BASE_URL}/children/available`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (childrenResponse.ok) {
        const childrenData = await childrenResponse.json()
        setStats((prev) => ({ ...prev, availableChildren: childrenData.length }))
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
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
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your account</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.adoptionRequests}</div>
              <div className="stat-label">My Applications</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👶</div>
            <div className="stat-content">
              <div className="stat-number">{stats.availableChildren}</div>
              <div className="stat-label">Available Children</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💝</div>
            <div className="stat-content">
              <div className="stat-number">{stats.donations}</div>
              <div className="stat-label">My Donations</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👨‍👩‍👧‍👦</div>
            <h3>Browse Children</h3>
            <p>View profiles of children available for adoption</p>
            <Link to="/children" className="btn btn-primary">
              View Children
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💝</div>
            <h3>Make a Donation</h3>
            <p>Support our mission with monetary or item donations</p>
            <Link to="/donations" className="btn btn-primary">
              Donate Now
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>My Applications</h3>
            <p>Track your adoption applications and their status</p>
            <Link to="/applications" className="btn btn-primary">
              View Applications
            </Link>
          </div>

          {user?.role === "admin" && (
            <div className="dashboard-card admin-card">
              <div className="card-icon">⚙️</div>
              <h3>Admin Panel</h3>
              <p>Manage children, applications, and donations</p>
              <Link to="/admin" className="btn btn-success">
                Admin Dashboard
              </Link>
            </div>
          )}
        </div>

        {recentRequests.length > 0 && (
          <div className="recent-activity">
            <h2>Recent Adoption Applications</h2>
            <div className="activity-list">
              {recentRequests.map((request) => (
                <div key={request._id} className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <p>
                      Application for <strong>{request.childId?.name}</strong>
                    </p>
                    <div className="activity-meta">
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(request.status) }}>
                        {request.status}
                      </span>
                      <span className="activity-time">{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/applications" className="view-all-link">
              View All Applications →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
