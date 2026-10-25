
const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Get all parking slots
router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM parking_slots ORDER BY slot_id',
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch parking slots' });
      }

      res.json(results);
    }
  );
});

// Add a vehicle to an available slot
router.put('/:slotId/vehicle', (req, res) => {
  const { slotId } = req.params;
  const { vehicleNumber } = req.body;

  if (!vehicleNumber || !vehicleNumber.trim()) {
    return res.status(400).json({ message: 'Vehicle number is required' });
  }

  db.query(
    `UPDATE parking_slots
     SET status = 'Occupied', vehicle_number = ?
     WHERE slot_id = ? AND status = 'Available'`,
    [vehicleNumber.trim().toUpperCase(), slotId],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'This vehicle is already assigned to a slot' });
        }

        return res.status(500).json({ message: 'Failed to assign vehicle' });
      }

      if (result.affectedRows === 0) {
        return res.status(409).json({
          message: 'Slot not found or already occupied'
        });
      }

      res.json({ message: 'Vehicle added successfully' });
    }
  );
});

// Remove a vehicle from a slot
router.delete('/:slotId/vehicle', (req, res) => {
  const { slotId } = req.params;

  db.query(
    `UPDATE parking_slots
     SET status = 'Available', vehicle_number = NULL
     WHERE slot_id = ? AND status = 'Occupied'`,
    [slotId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to remove vehicle' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Slot not found or already available'
        });
      }

      res.json({ message: 'Vehicle removed successfully' });
    }
  );
});

module.exports = router;
