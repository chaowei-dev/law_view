import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Table:
// id | jid | jyear | jcase | jno | jdate | jtitle | jfull \ remarks \ createdAt | updatedAt \ userId(FK to user table)

// Get all cases except jfull (every page have i items, use page to navigate)
router.get("/list/:size/:page/:searchKeyword", authenticateToken, async (req, res) => {
  const { size, page, searchKeyword } = req.params;
  const intSize = parseInt(size);
  const intPage = parseInt(page);
  const offset = (intPage - 1) * intSize;

  console.log(`search keyword:${searchKeyword}, size:${size}, page:${intPage}`);

  // if searchKeyword is undefined, return all cases
  let whereCaluse = {};
  if (searchKeyword !== "undefined") {
    whereCaluse = {
      OR: [
        { jid: { contains: searchKeyword } },
        { remarks: { contains: searchKeyword } }
      ]
    };
  }

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
        remarks: true,
        createdAt: true,
        updatedAt: true,
      },
      where: whereCaluse,
      skip: offset,
      take: intSize,
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
    const { jid, jyear, jcase, jno, jdate, jtitle, jfull, remarks, userId } =
      req.body;

    // Check if jid and jfull are provided
    if (!jid || !jfull) {
      return res.status(400).json({
        message: "Missing required fields: jid and jfull must be provided.",
      });
    }

    // Parse jyear and jno to integer
    const intJYEAR = parseInt(jyear);
    const intJNO = parseInt(jno);

    // Create to database
    try {
      const newCase = await prisma.case.create({
        data: {
          jid,
          jyear: intJYEAR,
          jcase,
          jno: intJNO,
          jdate,
          jtitle,
          jfull,
          remarks: remarks ? remarks : "",
          userId,
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

// Get number of cases by search keyword
router.get("/count/keyword/:searchKeyword", authenticateToken, async (req, res) => {
  const { searchKeyword } = req.params;
  let whereCaluse = {};
  if (searchKeyword !== "undefined") {
    whereCaluse = {
      OR: [
        { jid: { contains: searchKeyword } },
        { remarks: { contains: searchKeyword } }
      ]
    };
  }

  try {
    const count = await prisma.case.count({
      where: whereCaluse,
    });
    res.json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving case count by keyword", error: error.message });
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
    const { JID, JYEAR, JCASE, JNO, JDATE, JTITLE, JFULL, REMARKS } = req.body;

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
          remarks: REMARKS,
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
