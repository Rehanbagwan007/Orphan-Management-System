const Donation = require("../models/Donation")
const User = require("../models/User")

// Get all donations for a user
const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id })
      .populate("donorId", "name email")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })

    res.json(donations)
  } catch (error) {
    console.error("Error fetching user donations:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Create a new donation
const createDonation = async (req, res) => {
  try {
    const { type, amount, currency, itemName, itemDescription, itemValue, message } = req.body

    // Validation
    if (!type || !["money", "item"].includes(type)) {
      return res.status(400).json({ message: "Invalid donation type" })
    }

    if (type === "money" && (!amount || amount <= 0)) {
      return res.status(400).json({ message: "Amount is required for money donations" })
    }

    if (type === "item" && !itemName) {
      return res.status(400).json({ message: "Item name is required for item donations" })
    }

    const donationData = {
      donorId: req.user.id,
      type,
      message: message || "",
    }

    if (type === "money") {
      donationData.amount = amount
      donationData.currency = currency || "USD"
    } else {
      donationData.itemName = itemName
      donationData.itemDescription = itemDescription || ""
      donationData.itemValue = itemValue || 0
    }

    const donation = new Donation(donationData)
    await donation.save()

    // Populate the donation before sending response
    await donation.populate("donorId", "name email")

    res.status(201).json(donation)
  } catch (error) {
    console.error("Error creating donation:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get all donations for admin
const getAdminDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donorId", "name email phone")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })

    res.json(donations)
  } catch (error) {
    console.error("Error fetching admin donations:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update donation status (admin only)
const updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params
    const { status, adminNotes } = req.body

    if (!["pending", "approved", "rejected", "received"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const donation = await Donation.findById(donationId)
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" })
    }

    donation.status = status
    donation.adminNotes = adminNotes || ""
    donation.reviewedBy = req.user.id
    donation.reviewedAt = new Date()

    await donation.save()

    // Populate the donation before sending response
    await donation.populate("donorId", "name email phone")
    await donation.populate("reviewedBy", "name")

    res.json(donation)
  } catch (error) {
    console.error("Error updating donation status:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get donation statistics
const getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments()
    const pendingDonations = await Donation.countDocuments({ status: "pending" })
    const approvedDonations = await Donation.countDocuments({ status: "approved" })

    const totalMoneyDonations = await Donation.aggregate([
      { $match: { type: "money", status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const totalAmount = totalMoneyDonations.length > 0 ? totalMoneyDonations[0].total : 0

    res.json({
      total: totalDonations,
      pending: pendingDonations,
      approved: approvedDonations,
      totalAmount: totalAmount,
    })
  } catch (error) {
    console.error("Error fetching donation stats:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getUserDonations,
  createDonation,
  getAdminDonations,
  updateDonationStatus,
  getDonationStats,
}
