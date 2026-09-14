const express = require('express');
const router = express.Router();
const db = require('./db');


// PUT /api/resident/:residentId - Update resident profile
router.put('/:residentId', async (req, res) => {
  try {
    const residentId = req.params.residentId;
    const { resName, email, phoneno, unit } = req.body;

    const [result] = await db.query(
      `UPDATE resident 
       SET resName = ?, email = ?, phoneno = ?, unit = ? 
       WHERE residentId = ?`,
      [resName, email, phoneno, unit, residentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Resident not found" });
    }

    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating resident profile:", error);
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});


// GET /api/resident/:residentId - Get resident profile
router.get('/:residentId', async (req, res) => {
  try {
    const residentId = req.params.residentId;
    const [rows] = await db.query(
      `SELECT residentId, resName, email, phoneno, unit, createdAt 
       FROM resident 
       WHERE residentId = ?`,
      [residentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Resident not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching resident profile:", error);
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

// GET /api/resident/:residentId/stats - Get dashboard overview statistics
router.get('/:residentId/stats', async (req, res) => {
  try {
    const residentId = req.params.residentId;

    // 1. Count pending requests
    const [[{ pendingCount }]] = await db.query(
      `SELECT COUNT(*) as pendingCount FROM visitor_requests WHERE residentId = ? AND status = 'Pending'`,
      [residentId]
    );

    // 2. Count active visitor passes
    const [[{ activePassesCount }]] = await db.query(
      `SELECT COUNT(*) as activePassesCount FROM visitor_passes WHERE residentId = ? AND status = 'Active'`,
      [residentId]
    );

    // 3. Count visitors inside premises (Approved & exitTime is NULL)
    const [[{ insideCount }]] = await db.query(
      `SELECT COUNT(*) as insideCount FROM visitor_requests WHERE residentId = ? AND status = 'Approved' AND exitTime IS NULL`,
      [residentId]
    );

    // 4. Total visits today
    const [[{ totalTodayCount }]] = await db.query(
      `SELECT COUNT(*) as totalTodayCount FROM visitor_requests WHERE residentId = ? AND DATE(createdAt) = CURDATE()`,
      [residentId]
    );

    res.json({
      pendingCount: pendingCount || 0,
      activePassesCount: activePassesCount || 0,
      insideCount: insideCount || 0,
      totalTodayCount: totalTodayCount || 0
    });
  } catch (error) {
    console.error("Error fetching resident stats:", error);
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

// GET /api/resident/:residentId/pending_requests - Fetch live pending gate entry requests
router.get('/:residentId/pending_requests', async (req, res) => {
  try {
    const residentId = req.params.residentId;
    const [rows] = await db.query(
      `SELECT id, residentId, visitorId, visName, guardId, entryGate, status, entryTime, createdAt, type 
       FROM visitor_requests 
       WHERE residentId = ? AND status = 'Pending' 
       ORDER BY id DESC`,
      [residentId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

// PUT /api/resident/request/:requestId/status - Respond to gate request (Approved, Denied, Leave At Gate)
router.put('/request/:requestId/status', async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    const allowedStatuses = ['Approved', 'Denied', 'Leave At Gate'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value provided." });
    }

    let updateQuery = `UPDATE visitor_requests SET status = ?`;
    let queryParams = [status];

    if (status === 'Approved') {
      updateQuery += `, entryTime = NOW()`;
    }

    updateQuery += ` WHERE id = ?`;
    queryParams.push(requestId);

    const [result] = await db.query(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Visitor request not found." });
    }

    res.json({ message: `Gate request ${status.toLowerCase()} successfully.`, requestId, status });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

// GET /api/resident/:residentId/visitor_logs - Fetch all historical visitor logs
router.get('/:residentId/visitor_logs', async (req, res) => {
  try {
    const residentId = req.params.residentId;
    const [rows] = await db.query(
      `SELECT id, residentId, visitorId, visName, guardId, entryGate, status, entryTime, exitTime, createdAt, type 
       FROM visitor_requests 
       WHERE residentId = ? 
       ORDER BY id DESC 
       LIMIT 50`,
      [residentId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching visitor logs:", error);
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
});

module.exports = router;