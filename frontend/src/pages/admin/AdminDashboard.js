import { Routes, Route, Link, useLocation } from "react-router-dom"
import AdminOverview from "./AdminOverview"
import AdminChildren from "./AdminChildren"
import AdminAdoptions from "./AdminAdoptions"
import AdminDonations from "./AdminDonations"
import AdminUsers from "./AdminUsers"

const AdminDashboard = () => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage the orphanage system</p>
        </div>

        <div className="admin-nav">
          <Link to="/admin" className={`admin-nav-link ${isActive("/admin") ? "active" : ""}`}>
            Overview
          </Link>
          <Link to="/admin/children" className={`admin-nav-link ${isActive("/admin/children") ? "active" : ""}`}>
            Children
          </Link>
          <Link to="/admin/adoptions" className={`admin-nav-link ${isActive("/admin/adoptions") ? "active" : ""}`}>
            Adoptions
          </Link>
          <Link to="/admin/donations" className={`admin-nav-link ${isActive("/admin/donations") ? "active" : ""}`}>
            Donations
          </Link>
          <Link to="/admin/users" className={`admin-nav-link ${isActive("/admin/users") ? "active" : ""}`}>
            Users
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/children" element={<AdminChildren />} />
          <Route path="/adoptions" element={<AdminAdoptions />} />
          <Route path="/donations" element={<AdminDonations />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard
