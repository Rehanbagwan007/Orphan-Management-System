const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const childRoutes = require("./routes/children")
const adoptionRoutes = require("./routes/adoptions")
const donationRoutes = require("./routes/donations")
const uploadRoutes = require("./routes/upload")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.set("trust proxy", 1)



app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)




app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))


// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/orphan_management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/children", childRoutes)
app.use("/api/adoptions", adoptionRoutes)
app.use("/api/donations", donationRoutes)
app.use("/api/upload", uploadRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Orphan Management System API is running!" })
})





// Error handling middleware
///app.use((err, req, res, next) => {


 //console.error(err.stack)
  //res.status(500).json({ message: "Something went wrong!" })
//})


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})


