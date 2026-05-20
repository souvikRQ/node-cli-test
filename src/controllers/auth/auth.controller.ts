import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';
import { generateTokens, verifyRefreshToken } from '../../utils/token';

const userRepository = AppDataSource.getMongoRepository(User);

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Email, name, and password are required' });
    }

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Login user and return JWT tokens
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate access and refresh tokens
    const tokens = generateTokens({
      id: user._id.toString(),
      email: user.email,
    });

    return res.status(200).json({
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
