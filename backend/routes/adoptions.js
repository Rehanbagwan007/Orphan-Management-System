const express = require("express")
const {
  getUserAdoptionRequests,
  getAllAdoptionRequests,
  createAdoptionRequest,
  updateAdoptionRequestStatus,
} = require("../controllers/adoptionController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// User routes
router.get("/my-requests", authenticateToken, getUserAdoptionRequests)
router.post("/", authenticateToken, createAdoptionRequest)

// Admin routes
router.get("/", authenticateToken, requireAdmin, getAllAdoptionRequests)
router.put("/:id/status", authenticateToken, requireAdmin, updateAdoptionRequestStatus)

module.exports = router
