
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Helper: run a MySQL query
function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// Backend test
app.get("/", (req, res) => {
  res.send("EntriQ Guard Backend is running!");
});

// Dashboard statistics
app.get("/api/guard/dashboard", async (req, res) => {
  try {
    const [visitors] = await query(
      "SELECT COUNT(*) AS total FROM visitors"
    );
    const [pending] = await query(
      "SELECT COUNT(*) AS total FROM visitors WHERE status = 'Pending'"
    );
    const [vehicles] = await query(
      "SELECT COUNT(*) AS total FROM vehicles"
    );
    const [entries] = await query(
      "SELECT COUNT(*) AS total FROM entry_logs WHERE DATE(entry_time) = CURDATE()"
    );

    res.json({
      totalVisitors: visitors.total,
      pendingVisitors: pending.total,
      totalVehicles: vehicles.total,
      todayEntries: entries.total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List visitors
app.get("/api/visitors", async (req, res) => {
  try {
    res.json(await query("SELECT * FROM visitors ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 // Delete a visitor request
app.delete("/api/visitors/:id", async (req, res) => {
  try {
    const result = await query(
      "DELETE FROM visitors WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Visitor request not found.",
      });
    }

    res.json({
      message: "Visitor request deleted successfully.",
    });
  } catch (error) {
    console.error("Delete visitor error:", error);

    res.status(500).json({
      message:
        "Could not delete visitor request. It may have related entry records.",
    });
  }
});


// Search visitors by phone.
// Requires a phone column in the visitors table.
app.get("/api/visitors/search", async (req, res) => {
  try {
    const phone = String(req.query.phone || "").trim();
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    const rows = await query(
      "SELECT * FROM visitors WHERE phone = ?",
      [phone]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: "Visitor search failed. Check whether visitors has a phone column.",
    });
  }
});

// Verify a QR code against the database
app.post("/api/guard/verify-qr", async (req, res) => {
  try {
    const qr = String(req.body.qr || "").trim();
    if (!qr) return res.status(400).json({ error: "QR code is required" });

    const rows = await query(
      "SELECT * FROM visitors WHERE qr_code = ?",
      [qr]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Visitor QR code not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve visitor
app.post("/api/visitor/:id/approve", async (req, res) => {
  try {
    const result = await query(
      "UPDATE visitors SET status = 'Approved' WHERE id = ?",
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    res.json({ message: "Visitor approved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject visitor
app.post("/api/visitor/:id/reject", async (req, res) => {
  try {
    const result = await query(
      "UPDATE visitors SET status = 'Rejected' WHERE id = ?",
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    res.json({ message: "Visitor rejected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List vehicles
app.get("/api/vehicles", async (req, res) => {
  try {
    res.json(await query("SELECT * FROM vehicles ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Look up vehicle by registration number
app.get("/api/vehicle/:number", async (req, res) => {
  try {
    const rows = await query(
      "SELECT * FROM vehicles WHERE vehicle_number = ?",
      [req.params.number]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Entry logs
app.get("/api/entries", async (req, res) => {
  try {
    const rows = await query(`
      SELECT entry_logs.*, visitors.visitor_name, visitors.flat_number
      FROM entry_logs
      LEFT JOIN visitors ON entry_logs.visitor_id = visitors.id
      ORDER BY entry_logs.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exit logs: only records that have an exit time
app.get("/api/exits", async (req, res) => {
  try {
    const rows = await query(`
      SELECT entry_logs.*, visitors.visitor_name, visitors.flat_number
      FROM entry_logs
      LEFT JOIN visitors ON entry_logs.visitor_id = visitors.id
      WHERE entry_logs.exit_time IS NOT NULL
      ORDER BY entry_logs.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;


// Create a visitor request
app.post("/api/visitors", async (req, res) => {
  try {
    const {
      visitorName,
      phone,
      flatNumber,
      purpose,
      vehicleNumber,
    } = req.body;

    if (!visitorName || !phone || !flatNumber || !purpose) {
      return res.status(400).json({
        message: "Please provide all required visitor details.",
      });
    }

    const qrCode = `ENTRIQ-${Date.now()}`;

    const result = await query(
      `INSERT INTO visitors
       (visitor_name, phone, flat_number, purpose,
        vehicle_number, qr_code, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        visitorName.trim(),
        phone.trim(),
        flatNumber.trim().toUpperCase(),
        purpose.trim(),
        vehicleNumber?.trim().toUpperCase() || null,
        qrCode,
      ]
    );

    res.status(201).json({
      visitor: {
        id: result.insertId,
        name: visitorName.trim(),
        phone: phone.trim(),
        flat: flatNumber.trim().toUpperCase(),
        purpose: purpose.trim(),
        vehicle: vehicleNumber?.trim().toUpperCase() || "No vehicle",
        approval: "Pending",
        status: "Pending",
        createdAt: new Date().toISOString(),
        qrCode,
      },
    });
  } catch (error) {
    console.error("Create visitor error:", error);
    res.status(500).json({ message: "Could not save visitor request." });
  }
});


// Fetch the latest visitor approval status
app.get("/api/visitor/:id", async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, visitor_name, phone, flat_number, purpose,
              vehicle_number, qr_code, status, created_at
       FROM visitors WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Visitor not found." });
    }

    const v = rows[0];

    res.json({
      visitor: {
        id: v.id,
        name: v.visitor_name,
        phone: v.phone || "",
        flat: v.flat_number,
        purpose: v.purpose,
        vehicle: v.vehicle_number || "No vehicle",
        approval: v.status,
        status: v.status,
        createdAt: v.created_at,
        qrCode: v.qr_code,
      },
    });
  } catch (error) {
    console.error("Fetch visitor error:", error);
    res.status(500).json({ message: "Could not fetch visitor." });
  }
});


// Record entry only when the resident has approved
app.post("/api/visitor/:id/entry", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, status FROM visitors WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Visitor not found." });
    }

    if (rows[0].status !== "Approved") {
      return res.status(403).json({
        message: "Resident approval is required before entry.",
      });
    }

    const existing = await query(
      `SELECT id FROM entry_logs
       WHERE visitor_id = ? AND exit_time IS NULL`,
      [req.params.id]
    );

    if (existing.length) {
      return res.status(409).json({
        message: "An active entry already exists for this visitor.",
      });
    }

    const entryTime = new Date();

    await query(
      "INSERT INTO entry_logs (visitor_id, entry_time) VALUES (?, ?)",
      [req.params.id, entryTime]
    );

    await query(
      "UPDATE visitors SET status = 'Entered' WHERE id = ?",
      [req.params.id]
    );

    res.json({
      message: "Entry recorded successfully.",
      entryTime,
    });
  } catch (error) {
    console.error("Record entry error:", error);
    res.status(500).json({ message: "Could not record visitor entry." });
  }
});
app.listen(PORT, () => {
  console.log(`EntriQ backend running at http://localhost:${PORT}`);
});
