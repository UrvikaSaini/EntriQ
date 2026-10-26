
import { useState, useEffect } from "react";
import "./EntryLogs.css";

function EntryLogs() {
  const [search, setSearch] = useState("");

  const [entryLogs, setEntryLogs] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("entriqEntryLogs") || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const refreshLogs = () => {
      try {
        const records = JSON.parse(
          localStorage.getItem("entriqEntryLogs") || "[]"
        );
        setEntryLogs(Array.isArray(records) ? records : []);
      } catch {
        setEntryLogs([]);
      }
    };

    // Refresh when the page opens or regains focus
    refreshLogs();
    window.addEventListener("focus", refreshLogs);

    return () => {
      window.removeEventListener("focus", refreshLogs);
    };
  }, []);

  const filteredLogs = entryLogs.filter((log) => {
    const visitor = (log.visitor || "").toLowerCase();
    const flat = (log.flat || "").toLowerCase();
    const id = String(log.id || "").toLowerCase();
    const query = search.toLowerCase();

    return (
      visitor.includes(query) ||
      flat.includes(query) ||
      id.includes(query)
    );
  });

  return (
    <section className="entry-logs-page">
      <div className="entry-logs-header">
        <div>
          <span className="entry-label">SECURITY RECORDS</span>
          <h2>Entry Logs</h2>
          <p>Track all visitor entries recorded at the society gate.</p>
        </div>

        <div className="log-date">
          <span>Today's Entries</span>
          <strong>{entryLogs.length}</strong>
        </div>
      </div>

      <div className="entry-summary">
        <div className="entry-summary-card">
          <div className="entry-summary-icon">↘</div>
          <div>
            <span>Total Entries</span>
            <strong>{entryLogs.length}</strong>
          </div>
        </div>

        <div className="entry-summary-card">
          <div className="entry-summary-icon green">✓</div>
          <div>
            <span>QR Verified</span>
            <strong>{entryLogs.length}</strong>
          </div>
        </div>

        <div className="entry-summary-card">
          <div className="entry-summary-icon blue">●</div>
          <div>
            <span>Latest Entry</span>
            <strong>{entryLogs[0]?.time || "--"}</strong>
          </div>
        </div>
      </div>

      <div className="entry-logs-card">
        <div className="entry-logs-card-header">
          <div>
            <h3>Today's Entry Records</h3>
            <p>Visitors who entered the society today</p>
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
                        {(log.visitor || "?").charAt(0)}
                      </div>
                      <div>
                        <strong>{log.visitor}</strong>
                        <span>{log.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong className="entry-flat">{log.flat}</strong>
                  </td>
                  <td>{log.purpose}</td>
                  <td>{log.time}</td>
                  <td>
                    <span className="qr-badge">{log.qr}</span>
                  </td>
                  <td>{log.verifiedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="no-entry-logs">
              <div>⌕</div>
              <strong>No entry records found</strong>
              <p>Try searching with another visitor, flat or ID.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EntryLogs;
