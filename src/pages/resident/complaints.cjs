
const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Get all complaints
router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM complaints ORDER BY created_at DESC',
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch complaints' });
      }

      res.json(results);
    }
  );
});

// Add a new complaint

router.post('/', (req, res) => {
  const { resident_name, flat_no, description, category } = req.body;

  if (
    !resident_name?.trim() ||
    !flat_no?.trim() ||
    !description?.trim() ||
    !category?.trim()
  ) {
    return res.status(400).json({
      message: 'Name, flat number, description and category are required'
    });
  }

  db.query(
    `INSERT INTO complaints
      (resident_name, flat_no, description, category)
     VALUES (?, ?, ?, ?)`,
    [
      resident_name.trim(),
      flat_no.trim().toUpperCase(),
      description.trim(),
      category.trim()
    ],
    (err, result) => {
      if (err) {
        console.error('Failed to add complaint:', err.message);
        return res.status(500).json({
          message: 'Failed to add complaint'
        });
      }

      res.status(201).json({
        message: 'Complaint added successfully',
        id: result.insertId
      });
    }
  );
});


// Resolve a complaint
router.patch('/:id/resolve', (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE complaints
     SET status = 'Resolved'
     WHERE id = ? AND status = 'Pending'`,
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to resolve complaint' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Pending complaint not found'
        });
      }

      res.json({ message: 'Complaint resolved successfully' });
    }
  );
});

// Delete a complaint
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM complaints WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to delete complaint' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      res.json({ message: 'Complaint deleted successfully' });
    }
  );
});

module.exports = router;
