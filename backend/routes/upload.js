const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { upload } = require("../middleware/upload")
const { uploadFile, uploadMultipleFiles, deleteFile } = require("../controllers/uploadController")

const router = express.Router()

// Single file upload
router.post("/single", authenticateToken, upload.single("file"), uploadFile )

// Multiple files upload
router.post("/multiple", authenticateToken, upload.array("files", 5), uploadMultipleFiles)

// Delete file
router.delete("/:publicId", authenticateToken, deleteFile)

module.exports = router
