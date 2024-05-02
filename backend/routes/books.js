import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all books
router.get("/", authenticateToken, async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

// Create a new book
router.post(
  "/",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    console.log(req.body);
    const { title, author, year } = req.body;

    // Check if all required fields are provided
    if (!title || !author || typeof year !== "number") {
      return res.status(400).json({
        message:
          "Missing required fields: title, author, and year must be provided.",
      });
    }

    try {
      const newBook = await prisma.book.create({
        data: {
          title,
          author,
          year,
        },
      });
      res.status(201).json(newBook);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating book", error: error.message });
    }
  }
);

// Update a book
router.put(
  "/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { id } = req.params;
    const { title, author, year } = req.body;
    try {
      const updatedBook = await prisma.book.update({
        where: { id: parseInt(id) },
        data: {
          title,
          author,
          year,
        },
      });
      res.json(updatedBook);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating book", error: error.message });
    }
  }
);

// Delete a book
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.book.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting book", error: error.message });
    }
  }
);

export default router;
