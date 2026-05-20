import "reflect-metadata"
import express from "express"
import cors from "cors"
import { AppDataSource } from "./config/database"
import usersRoutes from "./routes/users.routes"
import * as dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
AppDataSource.initialize()
    .then(() => {
        console.log("✓ Database connected successfully")
    })
    .catch((error) => {
        console.error("✗ Database connection failed:", error)
        process.exit(1)
    })

// Routes
app.use("/api/v1", usersRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

// Error handler
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        console.error("Error:", err)
        res.status(500).json({ message: "Internal server error" })
    },
)

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`)
    console.log(`✓ API health check: http://localhost:${PORT}/health`)
})

export default app
