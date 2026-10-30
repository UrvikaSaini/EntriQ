const express = require('express');
const router = express.Router();
const db = require('./db.cjs'); // Uses your existing database connection file (adjust path if needed)

// 1. GET: Fetch all notices (with read status for the logged-in resident)
router.get('/', async (req, res) => {
    // Replace with req.user.id from your authentication middleware if available
    const residentId = req.user ? req.user.id : 1; 

    const query = `
        SELECT 
            n.*,
            IF(nrr.id IS NOT NULL, TRUE, FALSE) AS is_read
        FROM notices n
        LEFT JOIN notice_read_receipts nrr 
            ON n.id = nrr.notice_id AND nrr.resident_id = ?
        ORDER BY n.is_pinned DESC, n.created_at DESC;
    `;

    try {
        const [rows] = await db.query(query, [residentId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error fetching notices:', err.message);
        res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
});

// 2. POST: Create a new notice (Admin / Management)
router.post('/create', async (req, res) => {
    const { title, category, content, priority, is_pinned, attachment_url } = req.body;

    const query = `
        INSERT INTO notices (title, category, content, priority, is_pinned, attachment_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [
            title, 
            category || 'General', 
            content, 
            priority || 'Medium', 
            is_pinned || false, 
            attachment_url || null
        ]);
        
        res.status(201).json({ 
            success: true, 
            noticeId: result.insertId, 
            message: 'Notice broadcasted successfully' 
        });
    } catch (err) {
        console.error('Error creating notice:', err.message);
        res.status(500).json({ success: false, message: 'Failed to create notice', error: err.message });
    }
});

// 3. POST: Mark a notice as read by a resident
router.post('/:id/read', async (req, res) => {
    const noticeId = req.params.id;
    const residentId = req.user ? req.user.id : 1;

    const query = `
        INSERT IGNORE INTO notice_read_receipts (notice_id, resident_id)
        VALUES (?, ?)
    `;

    try {
        await db.query(query, [noticeId, residentId]);
        res.json({ success: true, message: 'Marked as read' });
    } catch (err) {
        console.error('Error updating read receipt:', err.message);
        res.status(500).json({ success: false, message: 'Failed to update read receipt' });
    }
});

module.exports = router;