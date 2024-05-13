import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Table:
// id | keyword | createdAt | updatedAt

// Create a initial keyword list
// keyword: "事實及理由", pattern:"/事\s*實|理\s*由/gi"
const createInitialKeywords = async () => {
  const keyword = await prisma.keyword.findUnique({
    where: { keyword: "事實及理由" },
  });
  if (!keyword) {
    console.log("事實及理由 not found, creating...");
    await prisma.keyword.create({
      data: {
        keyword: "事實及理由",
        pattern: "事\\s*實|理\\s*由",
      },
    });
  } else {
    console.log("事實及理由 already exists!");
  }
};
await createInitialKeywords();

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
    const { keyword, pattern } = req.body;

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
          pattern,
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
    const { keyword, pattern } = req.body;

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
          pattern,
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
