const User = require("../models/User")

// Get user profile
const getUserProfile = async (req, res) => {
  try {
   
    const user = await User.findById(req.user._id).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Server error while fetching profile" })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true },
    ).select("-password")

    res.json({
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    res.status(500).json({ message: "Server error while updating profile" })
  }
}

// Upload user document
const uploadDocument = async (req, res) => {
  try {
    const { name, url, type } = req.body

    

    const user = await User.findById(req.user._id)

    // Add document to user's documents array
    user.documents.push({
      name,
      url,
      type,
      uploadDate: new Date(),
    })

    await user.save()

    res.json({
      message: "Document uploaded successfully",
      document: user.documents[user.documents.length - 1],
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    res.status(500).json({ message: "Server error while uploading document" })
  }
}

// Delete user document
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params

    const user = await User.findById(req.user._id)
    user.documents = user.documents.filter((doc) => doc._id.toString() !== documentId)

    await user.save()

    res.json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("Error deleting document:", error)
    res.status(500).json({ message: "Server error while deleting document" })
  }
}

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Server error while fetching users" })
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadDocument,
  deleteDocument,
  getAllUsers,
}
