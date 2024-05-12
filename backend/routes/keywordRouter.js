import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Table:
// id | keyword | createdAt | updatedAt

// Get all keywords
router.get("/list", authenticateToken, async (req, res) => {
  try {
    const keywords = await prisma.keyword.findMany();
    res.json(keywords);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving keywords", error: error.message });
  }
});

// Create a new keyword by super-user
router.post(
  "/",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { keyword } = req.body;

    // Check if keyword is provided
    if (!keyword) {
      return res.status(400).json({
        message: "Missing required field: keyword must be provided.",
      });
    }

    try {
      const newKeyword = await prisma.keyword.create({
        data: {
          keyword,
        },
      });
      res.json(newKeyword);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating keyword", error: error.message });
    }
  }
);

// Update a keyword by super-user
router.put(
  "/update/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { id } = req.params;
    const { keyword } = req.body;

    // Check if keyword is provided
    if (!keyword) {
      return res.status(400).json({
        message: "Missing required field: keyword must be provided.",
      });
    }

    try {
      const updatedKeyword = await prisma.keyword.update({
        where: {
          id: parseInt(id),
        },
        data: {
          keyword,
        },
      });
      res.json(updatedKeyword);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating keyword", error: error.message });
    }
  }
);

// Delete a keyword by super-user
router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.keyword.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Keyword deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting keyword", error: error.message });
    }
  }
);

export default router;
