import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Table:
// id | jid | jyear | jcase | jno | jdate | jtitle | jfull

// Get all cases except jfull (every page have i items, use page to navigate)
router.get("/page/:limit/:page", authenticateToken, async (req, res) => {
  const { limit, page } = req.params;
  const intLimit = parseInt(limit);
  const intPage = parseInt(page);
  const offset = (intPage - 1) * intLimit;

  // Get all cases except jfull
  try {
    const cases = await prisma.case.findMany({
      select: {
        id: true,
        jid: true,
        jyear: true,
        jcase: true,
        jno: true,
        jdate: true,
        jtitle: true,
      },
      skip: offset,
      take: intLimit,
    });
    res.json(cases);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving cases", error: error.message });
  }
});

// Create a new case
router.post(
  "/",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { JID, JYEAR, JCASE, JNO, JDATE, JTITLE, JFULL } = req.body;

    // Check if jid and jfull are provided
    if (!JID || !JFULL) {
      return res.status(400).json({
        message: "Missing required fields: jid and jfull must be provided.",
      });
    }

    // Replace \r\n to <br/> for line break
    // const jfullWithBreak = JFULL.replace(/\r\n/g, "<br/>");

    const intJYEAR = parseInt(JYEAR);
    const intJNO = parseInt(JNO);

    try {
      const newCase = await prisma.case.create({
        data: {
          jid: JID,
          jyear: intJYEAR,
          jcase: JCASE,
          jno: intJNO,
          jdate: JDATE,
          jtitle: JTITLE,
          jfull: JFULL,
        },
      });
      res.status(201).json(newCase);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating case", error: error.message });
    }
  }
);

// Get number of cases
router.get("/count", authenticateToken, async (req, res) => {
  try {
    const count = await prisma.case.count();
    res.json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving case count", error: error.message });
  }
});

// Get case by case id
router.get("/case/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const caseById = await prisma.case.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(caseById);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving case by id", error: error.message });
  }
});

// Get id list of all cases
router.get("/all-id", authenticateToken, async (req, res) => {
  try {
    const caseIds = await prisma.case.findMany({
      select: { id: true },
    });
    res.json(caseIds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving case ids", error: error.message });
  }
});

// Update case by id, only update passing fields
router.put(
  "/update/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { id } = req.params;
    const { JID, JYEAR, JCASE, JNO, JDATE, JTITLE, JFULL } = req.body;

    // Replace \r\n to <br/> for line break
    // const jfullWithBreak = JFULL.replace(/\r\n/g, "<br/>");

    const intJYEAR = parseInt(JYEAR);
    const intJNO = parseInt(JNO);

    try {
      const updatedCase = await prisma.case.update({
        where: { id: parseInt(id) },
        data: {
          jid: JID,
          jyear: intJYEAR,
          jcase: JCASE,
          jno: intJNO,
          jdate: JDATE,
          jtitle: JTITLE,
          jfull: JFULL,
        },
      });
      res.json(updatedCase);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating case", error: error.message });
    }
  }
);

// Delete case by id
router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole(["super-user"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCase = await prisma.case.delete({
        where: { id: parseInt(id) },
      });
      res.json(deletedCase);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting case", error: error.message });
    }
  }
);

export default router;
