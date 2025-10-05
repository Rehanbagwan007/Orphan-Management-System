const mongoose = require("mongoose")

const childSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    photo: {
      type: String, // URL to photo
      default: "",
    },
    health: {
      status: {
        type: String,
        enum: ["excellent", "good", "fair", "needs_attention"],
        default: "good",
      },
      conditions: [
        {
          type: String,
        },
      ],
      lastCheckup: Date,
    },
    education: {
      level: {
        type: String,
        enum: ["none", "primary", "secondary", "high_school"],
        default: "none",
      },
      school: String,
      grade: String,
    },
    adoptionStatus: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available",
    },
    documents: [
      {
        name: String,
        url: String,
        type: String, // 'birth_certificate', 'medical_records', etc.
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    interests: [
      {
        type: String,
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Child", childSchema)
