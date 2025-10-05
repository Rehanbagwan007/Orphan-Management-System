const cloudinary = require("../config/cloudinary")
const { deleteFromCloudinary } = require("../middleware/upload")

// Upload single file
const uploadFile = async (req, res) => {
    
  try {

    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const fileData = {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      format: req.file.format,
    }

    res.json({
      message: "File uploaded successfully",
      file: fileData,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({ message: "Server error during file upload" })
  }
}

// Upload multiple files
const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" })
    }

    const filesData = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
      format: file.format,
    }))

    res.json({
      message: "Files uploaded successfully",
      files: filesData,
    })
  } catch (error) {
    console.error("Error uploading files:", error)
    res.status(500).json({ message: "Server error during file upload" })
  }
}

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params

    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" })
    }

    const result = await deleteFromCloudinary(publicId)

    if (result.result === "ok") {
      res.json({ message: "File deleted successfully" })
    } else {
      res.status(400).json({ message: "Failed to delete file" })
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    res.status(500).json({ message: "Server error during file deletion" })
  }
}

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
}
