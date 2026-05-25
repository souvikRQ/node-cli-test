import mongoose from "mongoose"
import { Response } from "express"
import * as bcrypt from "bcryptjs"

import { User } from "../../models/User"
import { ensureString } from "../../utils/string"
import { AuthRequest } from "../../middleware/auth"

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find()

        return res.status(200).json({
            message: "Users retrieved successfully",
            users: users.map((user) => ({
                _id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            })),
        })
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message })
    }
}

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
        })
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message })
    }
}

// Update user by ID
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id)
        const { email, name, password } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Check if new email is already in use by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                email,
            })
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" })
            }
            user.email = email
        }

        if (name) {
            user.name = name
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10)
        }

        await user.save()

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
        })
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message })
    }
}

// Delete user by ID
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }

        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "User deleted successfully",
        })
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message })
    }
}

// Get current authenticated user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = ensureString(req.user?.id)
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: "Invalid user ID" })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "Current user retrieved successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
        })
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message })
    }
}
