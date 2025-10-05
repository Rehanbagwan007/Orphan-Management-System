"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🏠</span>
            Orphan Care
          </Link>

          <div className="navbar-menu">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/children" className="nav-link">
                  Children
                </Link>
                <Link to="/applications" className="nav-link">
                  Applications
                </Link>
                <Link to="/donations" className="nav-link">
                  Donations
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="nav-link admin-link">
                    Admin
                  </Link>
                )}
                <div className="user-menu">
                  <span className="user-name">Hello, {user.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
