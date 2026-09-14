const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET requests for a specific resident (Pending / All)
router.get('/resident/:residentId', async (req, res) => {
  const { residentId } = req.params;
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM visitor_requests WHERE residentId = ?';
    let queryParams = [residentId];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await db.query(query, queryParams);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching visitor requests:', error);
    return res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// 2. POST request: Gate Guard creates an unannounced visitor entry request
router.post('/create', async (req, res) => {
  const { residentId, visitorId, visName, guardId, entryGate, type } = req.body;

  try {
    const query = `
      INSERT INTO visitor_requests (residentId, visitorId, visName, guardId, entryGate, status, type)
      VALUES (?, ?, ?, ?, ?, 'Pending', ?)
    `;
    const [result] = await db.query(query, [
      residentId,
      visitorId || null,
      visName,
      guardId || 1,
      entryGate || 'Main Gate',
      type || 'Guest'
    ]);

    return res.status(201).json({
      message: 'Visitor approval request sent to resident',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Error creating visitor request:', error);
    return res.status(500).json({ error: 'Failed to create request' });
  }
});

// 3. PATCH request: Resident approves or denies the request
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Approved' or 'Denied'

  if (!['Approved', 'Denied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    // If Approved, automatically record entryTime as NOW()
    const query = status === 'Approved'
      ? `UPDATE visitor_requests SET status = ?, entryTime = NOW() WHERE id = ?`
      : `UPDATE visitor_requests SET status = ? WHERE id = ?`;

    await db.query(query, [status, id]);
    return res.json({ message: `Request successfully updated to ${status}` });
  } catch (error) {
    console.error('Error updating request status:', error);
    return res.status(500).json({ error: 'Failed to update request status' });
  }
});

module.exports = router;