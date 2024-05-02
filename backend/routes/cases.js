import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Table:
// id | jid | jyear | jcase | jno | jdate | jtitle | jfull

// Get all cases
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cases = await prisma.case.findMany();
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

export default router;
