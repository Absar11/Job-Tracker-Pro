import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbService } from "../services/dbService.js";
import { UserRole } from "../models/User.js";

const JWT_DEFAULT_SECRET = "super_secret_jwt_key_job_tracker_pro_2026";

// Helper to sign JWT keys
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || JWT_DEFAULT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, role, avatar } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please provide name, email, and password." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
  }

  try {
    const existing = await dbService.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: "A user with this email already exists." });
    }

    // Set role
    const assignedRole = UserRole.USER;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await dbService.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      avatar: avatar || "",
    });

    const token = generateToken({
      id: user.id || user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully.",
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ success: false, message: "Registration failed. Internal server error." });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password" });
  }

  try {
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id || user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Log in successful.",
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error("Login failure:", err);
    return res.status(500).json({ success: false, message: "Server error during log in." });
  }
};

// Get profile
export const getUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized. Profile check failed." });
  }

  try {
    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error loading profile details" });
  }
};

// Update profile details
export const updateUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const { name, avatar } = req.body;

  try {
    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const db = dbService.useMongo;
    if (db) {
      const updatedUser = await dbService.findUserById(req.user.id);
      if (name) updatedUser.name = name;
      if (avatar !== undefined) updatedUser.avatar = avatar;
      await updatedUser.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
        },
      });
    } else {
      const localDb = dbService.readLocal();
      const userIdx = localDb.users.findIndex((u) => u._id === req.user.id);
      if (userIdx !== -1) {
        if (name) localDb.users[userIdx].name = name;
        if (avatar !== undefined) localDb.users[userIdx].avatar = avatar;
        localDb.users[userIdx].updatedAt = new Date().toISOString();
        dbService.writeLocal(localDb);

        return res.status(200).json({
          success: true,
          message: "Profile updated successfully.",
          user: {
            id: localDb.users[userIdx]._id,
            name: localDb.users[userIdx].name,
            email: localDb.users[userIdx].email,
            role: localDb.users[userIdx].role,
            avatar: localDb.users[userIdx].avatar,
          },
        });
      } else {
        return res.status(404).json({ success: false, message: "Local user match not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating profile details" });
  }
};
