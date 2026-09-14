const express=require('express');
const router=express.Router();
const db=require('./db');

// Check-In: Sets entryTime to current timestamp and status to Approved
router.patch('/:id/entry', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `UPDATE visitors SET entryTime = NOW(), status = 'Approved' WHERE id = ?`;
    await db.query(query, [id]);
    return res.json({ message: 'Visitor checked in successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Check-Out: Sets exitTime to current timestamp
router.patch('/:id/exit', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `UPDATE visitors SET exitTime = NOW() WHERE id = ?`;
    await db.query(query, [id]);
    return res.json({ message: 'Visitor checked out successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:residentId', async (req, res) => {
  const {name, phone, type, vehicle_no } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and Phone Number are Required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO visitors (name, phone, type, vehicle_no) VALUES (?, ?, ?, ?)",
      [name, phone, type || 'Guest', vehicle_no || null]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      phone,
      type: type || 'Guest',
      vehicle_no,
      message: "Visitor Created Successfully"
    });
  } catch (error) {
    console.error("Error in Creating Visitor:", error);
    res.status(500).json({ error: "Failed to Create Visitor Record" });
  }
});

router.get('/:residentId', async (req, res) => {
    const { residentId } = req.params;
    const { search, category, status } = req.query;

    try {
        let query = 'SELECT * FROM visitors WHERE residentId = ?';
        let queryParams = [residentId];

        if (status && status !== 'all') {
            query += ' AND status = ?';
            queryParams.push(status);
        }

        if (category && category !== 'all') {
            query += ' AND category = ?';
            queryParams.push(category);
        }

        if (search) {
            query += ' AND name LIKE ?';
            queryParams.push(`%${search}%`);
        }

        const [rows] = await db.query(query, queryParams);
        
        return res.json(rows);
    } catch (error) {
        console.error("Database Query Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports=router;