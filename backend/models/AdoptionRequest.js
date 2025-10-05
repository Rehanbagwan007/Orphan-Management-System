const mongoose = require("mongoose")

const adoptionRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    documents: [
      {
        name: String,
        url: String,
        type: String, // 'income_certificate', 'id_proof', 'marriage_certificate', etc.
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reason: {
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

module.exports = mongoose.model("AdoptionRequest", adoptionRequestSchema)
