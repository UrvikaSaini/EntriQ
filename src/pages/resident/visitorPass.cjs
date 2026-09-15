const express = require('express');
const router = express.Router();
const db = require('./db.cjs'); // Uses db connection exported from db.js

// Generate 6-character unique passcode (e.g., "PASS89")
function generatePassCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'P';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Convert ISO/datetime-local string to MySQL DATETIME format (YYYY-MM-DD HH:mm:ss)
function toMySQLDateTime(dateTimeStr) {
  if (!dateTimeStr) return null;
  if (dateTimeStr.includes('T')) {
    const [date, time] = dateTimeStr.split('T');
    const formattedTime = time.length === 5 ? `${time}:00` : time;
    return `${date} ${formattedTime}`;
  }
  return dateTimeStr;
}

// GET /api/visitor_passes/:residentId - Get all passes for a resident
router.get('/:residentId', async (req, res) => {
  try {
    const residentId = req.params.residentId;
    const [rows] = await db.query(
      `SELECT id, residentId, visName, visPhone, passCode, type, validFrom, validUpto, status, createdAt 
       FROM visitor_passes 
       WHERE residentId = ? 
       ORDER BY id DESC`,
      [residentId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching visitor passes:", error);
    res.status(500).json({ error: "Failed to fetch visitor passes from database" });
  }
});

// POST /api/visitor_passes - Create a new pass
/*router.post('/', async (req, res) => {
  try {
    const residentId = req.body.residentId || req.body.residentid || 1;
    const visName = req.body.visName || req.body.visitorName;
    const visPhone = req.body.visPhone || req.body.visitorPhone;
    const type = req.body.type || req.body.visitorType || 'Guest';
    
    // Set default dates if not provided
    const now = new Date();
    const defaultFrom = now.toISOString().slice(0, 16);
    
    const until = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const defaultUpto = until.toISOString().slice(0, 16);

    const validFrom = toMySQLDateTime(req.body.validFrom || defaultFrom);
    const validUpto = toMySQLDateTime(req.body.validUpto || req.body.validUntil || defaultUpto);

    if (!visName || !visPhone) {
      return res.status(400).json({ error: "Visitor name (visName) and phone (visPhone) are required." });
    }

    const passCode = generatePassCode();
    const status = 'Active';

    const [result] = await db.query(
      `INSERT INTO visitor_passes (residentId, visName, visPhone, passCode, type, validFrom, validUpto, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [residentId, visName, visPhone, passCode, type, validFrom, validUpto, status]
    );

    res.status(201).json({
      message: "Visitor pass generated successfully!",
      id: result.insertId,
      passCode: passCode,
      visName: visName,
      status: status
    });
  } catch (error) {
    console.error("Error generating visitor pass:", error);
    res.status(500).json({ error: "Failed to create visitor pass. Verify database connection." });
  }
});*/

// POST /api/visitor_passes
router.post('/', async (req, res) => {
  const {
    residentId,
    residentid,
    visitorName,
    visitorPhone,
    visitorType,
    validFrom,
    validUntil
  } = req.body;

  // Use whichever ID is provided by the frontend payload
  const activeResId = residentId || residentid || 1;
  
  // Generate unique pass code
  const passCode = `PASS-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // 1. Insert into visitor_passes table
    const passQuery = `
      INSERT INTO visitor_passes (residentId, visitorName, visitorPhone, passCode, passType, status, validFrom, validUntil, createdAt)
      VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?, NOW())
    `;
    const [passResult] = await db.query(passQuery, [
      activeResId,
      visitorName,
      visitorPhone,
      passCode,
      visitorType || 'Guest',
      validFrom || new Date(),
      validUntil
    ]);

    const createdPassId = passResult.insertId;

    // 2. Automatically log record into visitors table as expected
    const visitorQuery = `
      INSERT INTO visitors (residentId, passId, visitorName, visitorPhone, status, createdAt)
      VALUES (?, ?, ?, ?, 'EXPECTED', NOW())
    `;
    await db.query(visitorQuery, [
      activeResId,
      createdPassId,
      visitorName,
      visitorPhone
    ]);

    // Send passCode back so line 77 of VisitorPass.jsx displays it correctly
    res.status(201).json({
      message: 'Pass created and logged successfully',
      passId: createdPassId,
      passCode: passCode,
      passcode: passCode
    });
  } catch (error) {
    console.error('Error creating visitor pass:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/visitor_passes/revoke/:id - Revoke pass by ID
router.put('/revoke/:id', async (req, res) => {
  try {
    const passId = req.params.id;
    await db.query(
      "UPDATE visitor_passes SET status = 'Cancelled' WHERE id = ?",
      [passId]
    );
    res.json({ message: "Visitor pass cancelled successfully." });
  } catch (error) {
    console.error("Error revoking pass:", error);
    res.status(500).json({ error: "Failed to revoke visitor pass." });
  }
});

module.exports = router;