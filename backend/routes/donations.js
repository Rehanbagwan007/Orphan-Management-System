const express = require("express")
const { authenticateToken, requireAdmin } = require("../middleware/auth")
const {
  getUserDonations,
  createDonation,
  getAdminDonations,
  updateDonationStatus,
  getDonationStats,
} = require("../controllers/donationController")

const router = express.Router()

// User routes
router.get("/", authenticateToken, getUserDonations)
router.post("/", authenticateToken, createDonation)

// Admin routes
router.get("/admin", authenticateToken, requireAdmin, getAdminDonations)
router.get("/stats", authenticateToken, requireAdmin, getDonationStats)
router.put("/:donationId/status", authenticateToken, requireAdmin, updateDonationStatus)

module.exports = router
