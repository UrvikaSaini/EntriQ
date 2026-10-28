
import { useState, useEffect } from "react";
import { guardApi } from "../../services/guardApi";
import "./EntryLogs.css";

function EntryLogs() {
  const [search, setSearch] = useState("");
  const [entryLogs, setEntryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEntryLogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await guardApi.entryLogs();

        // Support common API response formats
        const data = response.data;
        const records = Array.isArray(data)
          ? data
          : Array.isArray(data.logs)
          ? data.logs
          : Array.isArray(data.entries)
          ? data.entries
          : Array.isArray(data.data)
          ? data.data
          : [];

        // Convert database field names into the UI format
        const formattedLogs = records.map((log) => ({
          id: log.id,
          visitor:
            log.visitor_name || log.visitor || log.name || "Unknown",
          flat: log.flat_number || log.flat || "",
          purpose: log.purpose || "",
          time:
            log.entry_time ||
            log.created_at ||
            log.time ||
            "--",
          qr: log.qr_code || log.qr || "--",
          verifiedBy: log.verified_by || log.verifiedBy || "Guard",
        }));

        setEntryLogs(formattedLogs);
      } catch (err) {
        console.error("Error loading entry logs:", err);
        setError(
          "Unable to load entry logs. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEntryLogs();
  }, []);

  const filteredLogs = entryLogs.filter((log) => {
    const query = search.toLowerCase();

    return (
      String(log.visitor).toLowerCase().includes(query) ||
      String(log.flat).toLowerCase().includes(query) ||
      String(log.id).toLowerCase().includes(query)
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
          <span>Total Entries</span>
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
            <strong>
              {entryLogs.filter((log) => log.qr !== "--").length}
            </strong>
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
            <h3>Entry Records</h3>
            <p>Visitors recorded in the database</p>
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
          {loading ? (
            <div className="no-entry-logs">
              Loading entry records...
            </div>
          ) : error ? (
            <div className="no-entry-logs">
              <strong>{error}</strong>
              <button onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : (
            <>
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
                  {filteredLogs.map((log, index) => (
                    <tr key={log.id ?? index}>
                      <td>
                        <div className="entry-visitor">
                          <div className="entry-avatar">
                            {String(log.visitor).charAt(0)}
                          </div>
                          <div>
                            <strong>{log.visitor}</strong>
                            <span>{log.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong className="entry-flat">
                          {log.flat || "--"}
                        </strong>
                      </td>
                      <td>{log.purpose || "--"}</td>
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
                  <strong>
                    {entryLogs.length === 0
                      ? "No entry records in the database"
                      : "No entry records found"}
                  </strong>
                  <p>
                    {entryLogs.length === 0
                      ? "Records will appear after entries are saved by the backend."
                      : "Try searching with another visitor, flat or ID."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default EntryLogs;
