const express = require("express")
const {
  getUserProfile,
  updateUserProfile,
  uploadDocument,
  deleteDocument,
  getAllUsers,
} = require("../controllers/userController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// User routes
router.get("/profile",authenticateToken, getUserProfile)
router.put("/profile", authenticateToken, updateUserProfile)
router.post("/documents", authenticateToken, uploadDocument)
router.delete("/documents/:documentId", authenticateToken, deleteDocument)

// Admin routes
router.get("/", authenticateToken, requireAdmin, getAllUsers)

module.exports = router
