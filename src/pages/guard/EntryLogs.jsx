
import { useState } from "react";
import "./EntryLogs.css";

function EntryLogs() {
  const [search, setSearch] = useState("");

  const entryLogs = [
    {
      id: "E001",
      visitor: "Rahul Sharma",
      flat: "A-204",
      purpose: "Guest Visit",
      time: "09:42 PM",
      qr: "QR001",
      verifiedBy: "Guard 01",
    },
    {
      id: "E002",
      visitor: "Priya Mehta",
      flat: "B-102",
      purpose: "Personal Visit",
      time: "08:15 PM",
      qr: "QR002",
      verifiedBy: "Guard 01",
    },
    {
      id: "E003",
      visitor: "Arjun Kapoor",
      flat: "C-305",
      purpose: "Family Visit",
      time: "07:30 PM",
      qr: "QR003",
      verifiedBy: "Guard 02",
    },
    {
      id: "E004",
      visitor: "Neha Verma",
      flat: "A-105",
      purpose: "Delivery",
      time: "06:50 PM",
      qr: "QR004",
      verifiedBy: "Guard 01",
    },
  ];

  const filteredLogs = entryLogs.filter(
    (log) =>
      log.visitor.toLowerCase().includes(search.toLowerCase()) ||
      log.flat.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="entry-logs-page">

      {/* HEADER */}
      <div className="entry-logs-header">
        <div>
          <span className="entry-label">
            SECURITY RECORDS
          </span>

          <h2>Entry Logs</h2>

          <p>
            Track all visitor entries recorded at the society gate.
          </p>
        </div>

        <div className="log-date">
          <span>Today's Entries</span>
          <strong>{entryLogs.length}</strong>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="entry-summary">

        <div className="entry-summary-card">
          <div className="entry-summary-icon">
            ↘
          </div>

          <div>
            <span>Total Entries</span>
            <strong>{entryLogs.length}</strong>
          </div>
        </div>

        <div className="entry-summary-card">
          <div className="entry-summary-icon green">
            ✓
          </div>

          <div>
            <span>QR Verified</span>
            <strong>{entryLogs.length}</strong>
          </div>
        </div>

        <div className="entry-summary-card">
          <div className="entry-summary-icon blue">
            ●
          </div>

          <div>
            <span>Latest Entry</span>
            <strong>09:42 PM</strong>
          </div>
        </div>

      </div>

      {/* LOG TABLE */}
      <div className="entry-logs-card">

        <div className="entry-logs-card-header">

          <div>
            <h3>Today's Entry Records</h3>

            <p>
              Visitors who entered the society today
            </p>
          </div>

          <div className="entry-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search visitor, flat or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        <div className="entry-table-wrapper">

          <table className="entry-table">

            <thead>
              <tr>
                <th>Visitor</th>
                <th>Flat</th>
                <th>Purpose</th>
                <th>Entry Time</th>
                <th>QR ID</th>
                <th>Verified By</th>
              </tr>
            </thead>

            <tbody>

              {filteredLogs.map((log) => (

                <tr key={log.id}>

                  <td>
                    <div className="entry-visitor">

                      <div className="entry-avatar">
                        {log.visitor.charAt(0)}
                      </div>

                      <div>
                        <strong>{log.visitor}</strong>
                        <span>{log.id}</span>
                      </div>

                    </div>
                  </td>

                  <td>
                    <strong className="entry-flat">
                      {log.flat}
                    </strong>
                  </td>

                  <td>
                    {log.purpose}
                  </td>

                  <td>
                    {log.time}
                  </td>

                  <td>
                    <span className="qr-badge">
                      {log.qr}
                    </span>
                  </td>

                  <td>
                    {log.verifiedBy}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredLogs.length === 0 && (
            <div className="no-entry-logs">
              <div>⌕</div>

              <strong>
                No entry records found
              </strong>

              <p>
                Try searching with another visitor, flat or ID.
              </p>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default EntryLogs;

