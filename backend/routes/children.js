const express = require("express")
const {
  getAvailableChildren,
  getAllChildren,
  getChildById,
  addChild,
  updateChild,
  deleteChild,
} = require("../controllers/childController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

const router = express.Router()

// Public routes (authenticated users)
router.get("/available", authenticateToken, getAvailableChildren)
router.get("/:id", authenticateToken, getChildById)

// Admin only routes
router.get("/", authenticateToken, requireAdmin, getAllChildren)
router.post("/" , authenticateToken, requireAdmin,  upload.single("file")  ,addChild)
router.put("/:id", authenticateToken, requireAdmin, updateChild)
router.delete("/:id", authenticateToken, requireAdmin, deleteChild)

module.exports = router
