import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Check admin user
// If not exists, create one
const createInitUser = async () => {
  // Check admin user existed
  const adminUser = await prisma.user.findUnique({
    where: { username: "admin" },
  });
  if (!adminUser) {
    console.log("No admin user found, creating one...");
    const hashedPassword = await bcrypt.hash("tkuntpu", 12);
    await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
        role: "super-user",
      },
    });
    console.log("Admin user created!");
  } else {
    console.log("Admin user already exists!");
  }

  // Check normal user existed
  const normalUser = await prisma.user.findUnique({
    where: { username: "user" },
  });
  if (!normalUser) {
    console.log("No normal user found, creating one...");
    const hashedPassword = await bcrypt.hash("tkuntpu", 12);
    await prisma.user.create({
      data: {
        username: "user",
        password: hashedPassword,
        role: "user",
      },
    });
    console.log("Normal user created!");
  } else {
    console.log("Normal user already exists!");
  }
};
await createInitUser();

router.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Check if the user already exists
    const userExists = await prisma.user.findUnique({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    // Log msg
    console.log("User created!");

    // Return the user ID
    res.status(201).json({ message: "User created", userId: newUser.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    // If there is an error or no user, send error
    if (err || !user) {
      return res
        .status(400)
        .json({ message: info?.message || "Login failed", user });
    }

    // Log in the user
    req.login(user, { session: false }, async (error) => {
      if (error) {
        res.send(error);
      }

      // Create a token
      const body = { id: user.id, username: user.username, role: user.role };
      const token = jwt.sign({ user: body }, "secret_key", { expiresIn: "4h" });

      // Log msg
      console.log("User logged in!");

      // Return the token
      return res.json({ token });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.json({ message: "Please clear your token to complete logout." });
});

// Get all users
router.get(
  "/list",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany();

      // Remove the password from the response
      users.forEach((user) => {
        delete user.password;
      });

      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving users", error: error.message });
    }
  }
);

// Update user only by super-user
router.put(
  "/update/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    // Get elements
    const { username, role } = req.body;
    const { id } = req.params;

    // Update user with prisma
    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          username,
          role,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }
);

// Update passport
router.put("/change-password", authenticateToken, async (req, res) => {
  // Get elements
  const { username, password } = req.body;
  // const { id } = req.params;

  // Hash the password
  const hashedNewPassword = await bcrypt.hash(password, 12);

  // Update user with prisma
  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        password: hashedNewPassword,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
});

// Delete user only by super-user
router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    // Get user id
    const { id } = req.params;
    // Delete user with prisma
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "User Deleted", username: deletedUser.username });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  }
);

export default router;
