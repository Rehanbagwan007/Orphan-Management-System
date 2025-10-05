const Child = require("../models/Child")

// Get all available children for adoption
const getAvailableChildren = async (req, res) => {
  try {
    const children = await Child.find({
      adoptionStatus: "available",
    })
      .populate("addedBy", "name")
      .sort({ createdAt: -1 })

    res.json(children)
  } catch (error) {
    console.error("Error fetching children:", error)
    res.status(500).json({ message: "Server error while fetching children" })
  }
}

// Get all children (admin only)
const getAllChildren = async (req, res) => {
  try {
    const children = await Child.find().populate("addedBy", "name").sort({ createdAt: -1 })

    res.json(children)
  } catch (error) {
    console.error("Error fetching all children:", error)
    res.status(500).json({ message: "Server error while fetching children" })
  }
}

// Get single child by ID
const getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id).populate("addedBy", "name")

    if (!child) {
      return res.status(404).json({ message: "Child not found" })
    }

    res.json(child)
  } catch (error) {
    console.error("Error fetching child:", error)
    res.status(500).json({ message: "Server error while fetching child" })
  }
}

// Add new child (admin only)
const addChild = async (req, res) => {
  
  try {
    const { name, age, gender, photo, health, education, description, interests } = req.body

    const child = new Child({
      name,
      age,
      gender,
      photo,
      health,
      education,
      description,
      interests,
      addedBy: req.user._id,
    })

    await child.save()

    const populatedChild = await Child.findById(child._id).populate("addedBy", "name")

    res.status(201).json({
      message: "Child added successfully",
      child: populatedChild,
    })
  } catch (error) {
    console.error("Error adding child:", error)
    res.status(500).json({ message: "Server error while adding child" })
  }
}

// Update child (admin only)
const updateChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(
      "addedBy",
      "name",
    )

    if (!child) {
      return res.status(404).json({ message: "Child not found" })
    }

    res.json({
      message: "Child updated successfully",
      child,
    })
  } catch (error) {
    console.error("Error updating child:", error)
    res.status(500).json({ message: "Server error while updating child" })
  }
}

// Delete child (admin only)
const deleteChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id)

    if (!child) {
      return res.status(404).json({ message: "Child not found" })
    }

    res.json({ message: "Child deleted successfully" })
  } catch (error) {
    console.error("Error deleting child:", error)
    res.status(500).json({ message: "Server error while deleting child" })
  }
}

module.exports = {
  getAvailableChildren,
  getAllChildren,
  getChildById,
  addChild,
  updateChild,
  deleteChild,
}
