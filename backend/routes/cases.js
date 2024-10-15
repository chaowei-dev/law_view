import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';
import {
  buildDynamicKeywordClause,
  buildDynamicOrderBy,
  processJfull,
} from '../utils/processKeyword.js';
import axios from 'axios';
import fs from 'fs';
import csv from 'csv-parser';
import multer from 'multer';

const router = express.Router();
const prisma = new PrismaClient();
// const upload = multer({ dest: 'uploads/' });

// Table:
// id | jid | jyear | jcase | jno | jdate | jtitle | jfull \ remarks \ createdAt | updatedAt \ userId(FK to user table)

// Get case list with detail and summary jfull (every page have i items, use page to navigate)
router.get(
  '/list/:size/:page/:searchKeyword',
  authenticateToken,
  async (req, res) => {
    const { size, page, searchKeyword } = req.params;
    const intSize = parseInt(size);
    const intPage = parseInt(page);
    const offset = (intPage - 1) * intSize;

    // Log
    console.log(`size:${size}, page:${intPage}`);

    // Build where clause dynamically
    let whereClause = buildDynamicKeywordClause(searchKeyword);

    // Build orderBy for updatedAt (default(id), desc, asc)
    let orderByClause = buildDynamicOrderBy(searchKeyword);

    // Improved logging
    // console.log("whereClause: ", JSON.stringify(whereClause, null, 2));

    console.log('');

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
          jfull: true,
          is_hide: true,
        },
        where: whereClause,
        skip: offset,
        take: intSize,
        orderBy: orderByClause,
      });

      // Summary jfull with every case
      const processedCases = processJfull(cases, searchKeyword);

      res.json(processedCases);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving cases', error: error.message });
    }
  }
);

// Create a new case
router.post(
  '/',
  authenticateToken,
  checkRole(['super-user']),
  async (req, res) => {
    const { jid, jyear, jcase, jno, jdate, jtitle, jfull, remarks, userId } =
      req.body;

    // Check if jid and jfull are provided
    if (!jid || !jfull) {
      return res.status(400).json({
        message: 'Missing required fields: jid and jfull must be provided.',
      });
    }

    // Parse jyear and jno to integer
    const intJYEAR = parseInt(jyear);
    const intJNO = parseInt(jno);

    try {
      // Check if a case with the given jid already exists
      const existingCase = await prisma.case.findUnique({
        where: { jid: jid },
      });

      if (existingCase) {
        return res
          .status(409)
          .json({ message: 'A case with this jid already exists.' });
      }

      // If jid doesn't exist, create the new case
      const newCase = await prisma.case.create({
        data: {
          jid,
          jyear: intJYEAR,
          jcase,
          jno: intJNO,
          jdate,
          jtitle,
          jfull,
          remarks: remarks ? remarks : '',
          userId,
        },
      });
      res.status(201).json(newCase);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error processing case', error: error.message });
    }
  }
);
// Get number of cases
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const count = await prisma.case.count();
    res.json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving case count', error: error.message });
  }
});

// Get number of cases by search keyword
router.get(
  '/count/keyword/:searchKeyword',
  authenticateToken,
  async (req, res) => {
    const { searchKeyword } = req.params;

    // Build where clause dynamically
    let whereCaluse = buildDynamicKeywordClause(searchKeyword);

    try {
      const count = await prisma.case.count({
        where: whereCaluse,
      });

      // Log
      console.log(`count: ${count}`);

      res.json({ count });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving case count by keyword',
        error: error.message,
      });
    }
  }
);

// Get case by case id
router.get('/case/:isLabel/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isLabel } = req.params;

  console.log(`isLabel: ${isLabel}`);

  try {
    // Get case data by id
    let caseData = await prisma.case.findUnique({
      where: { id: parseInt(id) },
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
        jfull: true,
        is_hide: true,
        isHideUpdateAt: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    let dataExtraction = {};

    // Get jfull and process it
    let jfull = caseData.jfull;
    // replace " ", "\n", "\t", "\r", "　", "\\r\\n"
    jfull = jfull.replace(/[\s\n\t\r　]/g, '');

    // isLabel is true, then get data extraction
    if (isLabel === 'true') {
      // Get data extraction from http://localhost:3005/api/extract
      try {
        // const response = await axios.post('http://localhost:3005/api/extract', {
        const response = await axios.post('http://flask_api:3005/api/extract', {
          text: jfull,
        });
        dataExtraction = response.data;
      } catch (error) {
        dataExtraction = `Error extracting data: ${error.message}`;
      }

      // If any dataExtraction' value is not found, set it to empty string
      const dataExtractionKeys = [
        'compensation_amount',
        'injured_part',
        'labor_ability_reduction',
        'medical_expense',
        'request_amount',
      ];

      // Check if dataExtraction has all keys
      // If value is "Not Found", set it to empty string
      // If length is 0, set it to empty string
      dataExtractionKeys.forEach((key) => {
        console.log(`key: ${key}, value: ${dataExtraction[key]}`);

        if (!dataExtraction[key] || dataExtraction[key] === 'Not Found') {
          dataExtraction = {};
        }
      });
    }

    // add dataExtraction to caseData
    caseData.dataExtraction = dataExtraction;

    // Response caseData
    res.json(caseData);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving case by id', error: error.message });
  }
});

// Get id list of all cases
router.get('/all-id/:isLabel', authenticateToken, async (req, res) => {
  const { isLabel } = req.params;

  const isHide = isLabel === 'true' ? false : true;

  try {
    // Order by isHideUpdateAt table's updatedAt timestamp
    let orderByClause = {};
    if (isHide === false) {
      orderByClause = { isHideUpdateAt: { updatedAt: 'asc' } };
    }

    // Get all case ids
    const caseIds = await prisma.case.findMany({
      select: { id: true },
      where: { is_hide: isHide },
      orderBy: orderByClause,
    });

    res.json(caseIds);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving case ids',
      error: error.message,
    });
  }
});

// Update case by id, only update passing fields
router.put(
  '/update/:id',
  authenticateToken,
  checkRole(['super-user']),
  async (req, res) => {
    const { id } = req.params;
    // const { JID, JYEAR, JCASE, JNO, JDATE, JTITLE, JFULL, REMARKS } = req.body;
    const { REMARKS } = req.body;

    // Replace \r\n to <br/> for line break
    // const jfullWithBreak = JFULL.replace(/\r\n/g, "<br/>");

    // const intJYEAR = parseInt(JYEAR);
    // const intJNO = parseInt(JNO);

    try {
      const updatedCase = await prisma.case.update({
        where: { id: parseInt(id) },
        data: {
          // jid: JID,
          // jyear: intJYEAR,
          // jcase: JCASE,
          // jno: intJNO,
          // jdate: JDATE,
          // jtitle: JTITLE,
          // jfull: JFULL,
          remarks: REMARKS,
        },
      });
      res.json(updatedCase);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error updating case', error: error.message });
    }
  }
);

// Delete case by id
router.delete(
  '/delete/:id',
  authenticateToken,
  checkRole(['super-user']),
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
        .json({ message: 'Error deleting case', error: error.message });
    }
  }
);

// Handle .csv file name
// Configure multer
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Accept csv files only
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error('Only CSV files are allowed!'), false);
    }
    cb(null, true);
  },
}).single('file');

// Mark is_hide to false
// Send a .csv file to backend to update is_hide to false
// .csv file have multiple case title
router.post(
  '/mark-case',
  authenticateToken,
  checkRole(['super-user']),
  async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).send(`Multer upload error: ${err.message}`);
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).send(`Unknown upload error: ${err.message}`);
      }

      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      const results = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            let updatedCount = 0;
            let skippedCount = 0;

            console.log('Marking cases...');

            for (let row of results) {
              // Update is_hide to false for Case table
              const updatedCase = await prisma.case.updateMany({
                where: {
                  jid: row.jid,
                  is_hide: true,
                },
                data: { is_hide: false },
              });

              if (updatedCase.count > 0) {
                // Count updated cases
                updatedCount += updatedCase.count;

                // Find id of case from jid
                const caseRecord = await prisma.case.findFirst({
                  where: { jid: row.jid },
                  select: { id: true },
                });

                if (caseRecord) {
                  await prisma.isHideUpdateAt.upsert({
                    where: { caseId: caseRecord.id },
                    update: { updatedAt: new Date() },
                    create: { caseId: caseRecord.id },
                  });
                }
              } else {
                // Count skipped cases
                skippedCount++;
              }
            }

            // Delete the uploaded file
            fs.unlinkSync(req.file.path);

            res.json({
              message: `${updatedCount} cases updated successfully. ${skippedCount} cases skipped (not found in database).`,
            });
          } catch (err) {
            console.error('Error processing CSV:', err);
            res.status(500).send(`Error processing CSV file: ${err.message}`);
          }
        });
    });
  }
);

// Mark all cases is_hide to true
router.put(
  '/mark-case-to-hide',
  authenticateToken,
  checkRole(['super-user']),
  async (req, res) => {
    try {
      const updatedCase = await prisma.case.updateMany({
        where: { is_hide: false },
        data: { is_hide: true },
      });

      console.log('All cases marked as hidden.');

      res.json(updatedCase);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error updating all cases', error: error.message });
    }
  }
);

export default router;
