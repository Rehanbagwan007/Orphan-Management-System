"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Bringing Hope to Children in Need</h1>
            <p className="hero-subtitle">
              Our orphan management system connects loving families with children who need homes, while supporting our
              community through donations and care.
            </p>

            {!user ? (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
                <Link to="/children" className="btn btn-secondary btn-large">
                  Browse Children
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">How We Help</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <h3>Adoption Services</h3>
              <p>Connect with children who need loving homes through our secure adoption process.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Donation Platform</h3>
              <p>Support our mission through monetary donations or by contributing essential items.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Transparent Management</h3>
              <p>Track your applications and donations with our transparent management system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
