const AdoptionRequest = require("../models/AdoptionRequest")
const Child = require("../models/Child")

// Get user's adoption requests
const getUserAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ userId: req.user._id })
      .populate("childId", "name age gender photo")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    console.error("Error fetching adoption requests:", error)
    res.status(500).json({ message: "Server error while fetching adoption requests" })
  }
}

// Get all adoption requests (admin only)
const getAllAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find()
      .populate("userId", "name email phone")
      .populate("childId", "name age gender photo")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    console.error("Error fetching all adoption requests:", error)
    res.status(500).json({ message: "Server error while fetching adoption requests" })
  }
}

// Create adoption request
const createAdoptionRequest = async (req, res) => {
  try {
    const { childId, reason, documents } = req.body

    // Check if child exists and is available
    const child = await Child.findById(childId)
    if (!child) {
      return res.status(404).json({ message: "Child not found" })
    }

    if (child.adoptionStatus !== "available") {
      return res.status(400).json({ message: "Child is not available for adoption" })
    }

    // Check if user already has a pending request for this child
    const existingRequest = await AdoptionRequest.findOne({
      userId: req.user._id,
      childId,
      status: { $in: ["pending", "approved"] },
    })

    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending request for this child" })
    }

    const adoptionRequest = new AdoptionRequest({
      userId: req.user._id,
      childId,
      reason,
      documents: documents || [],
    })

    await adoptionRequest.save()

    // Update child status to pending
    await Child.findByIdAndUpdate(childId, { adoptionStatus: "pending" })

    const populatedRequest = await AdoptionRequest.findById(adoptionRequest._id)
      .populate("childId", "name age gender photo")
      .populate("userId", "name email")

    res.status(201).json({
      message: "Adoption request submitted successfully",
      request: populatedRequest,
    })
  } catch (error) {
    console.error("Error creating adoption request:", error)
    res.status(500).json({ message: "Server error while creating adoption request" })
  }
}

// Update adoption request status (admin only)
const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body
    const requestId = req.params.id

    const adoptionRequest = await AdoptionRequest.findById(requestId).populate("childId")

    if (!adoptionRequest) {
      return res.status(404).json({ message: "Adoption request not found" })
    }

    // Update request
    adoptionRequest.status = status
    adoptionRequest.adminNotes = adminNotes
    adoptionRequest.reviewedBy = req.user._id
    adoptionRequest.reviewedAt = new Date()

    await adoptionRequest.save()

    // Update child status based on request status
    let childStatus = "available"
    if (status === "approved") {
      childStatus = "adopted"
    } else if (status === "rejected") {
      childStatus = "available"
    }

    await Child.findByIdAndUpdate(adoptionRequest.childId._id, {
      adoptionStatus: childStatus,
    })

    const updatedRequest = await AdoptionRequest.findById(requestId)
      .populate("userId", "name email phone")
      .populate("childId", "name age gender photo")
      .populate("reviewedBy", "name")

    res.json({
      message: "Adoption request updated successfully",
      request: updatedRequest,
    })
  } catch (error) {
    console.error("Error updating adoption request:", error)
    res.status(500).json({ message: "Server error while updating adoption request" })
  }
}

module.exports = {
  getUserAdoptionRequests,
  getAllAdoptionRequests,
  createAdoptionRequest,
  updateAdoptionRequestStatus,
}
