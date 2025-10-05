const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["money", "item"],
      required: true,
    },
    // For money donations
    amount: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    // For item donations
    itemName: String,
    itemDescription: String,
    itemValue: {
      type: Number,
      min: 0,
    },
    itemPhoto: String, // URL to item photo

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "received"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Donation", donationSchema)
