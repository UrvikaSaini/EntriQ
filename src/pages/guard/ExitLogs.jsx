
import { useState, useEffect } from "react";
import { guardApi } from "../../services/guardApi";
import "./ExitLogs.css";

function ExitLogs() {
  const [search, setSearch] = useState("");
  const [exitLogs, setExitLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExitLogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await guardApi.exitLogs();
        const data = response.data;

        const records = Array.isArray(data)
          ? data
          : Array.isArray(data.logs)
          ? data.logs
          : Array.isArray(data.exits)
          ? data.exits
          : Array.isArray(data.data)
          ? data.data
          : [];

        const formattedLogs = records.map((log) => ({
          id: log.id,
          visitor:
            log.visitor_name || log.visitor || log.name || "Unknown",
          flat: log.flat_number || log.flat || "",
          purpose: log.purpose || "",
          entry: log.entry_time || log.entry || "--",
          exit: log.exit_time || log.exit || log.created_at || "--",
          duration: log.duration || "--",
          qr: log.qr_code || log.qr || "--",
        }));

        setExitLogs(formattedLogs);
      } catch (err) {
        console.error("Error loading exit logs:", err);
        setError(
          "Unable to load exit logs. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExitLogs();
  }, []);

  const query = search.toLowerCase();

  const filteredLogs = exitLogs.filter(
    (log) =>
      String(log.visitor).toLowerCase().includes(query) ||
      String(log.flat).toLowerCase().includes(query) ||
      String(log.id).toLowerCase().includes(query)
  );

  return (
    <section className="exit-logs-page">
      <div className="exit-logs-header">
        <div>
          <span className="exit-label">SECURITY RECORDS</span>
          <h2>Exit Logs</h2>
          <p>Track visitors who have exited the society.</p>
        </div>

        <div className="exit-date">
          <span>Total Exits</span>
          <strong>{exitLogs.length}</strong>
        </div>
      </div>

      <div className="exit-summary">
        <div className="exit-summary-card">
          <div className="exit-summary-icon">↗</div>
          <div>
            <span>Total Exits</span>
            <strong>{exitLogs.length}</strong>
          </div>
        </div>

        <div className="exit-summary-card">
          <div className="exit-summary-icon green">✓</div>
          <div>
            <span>Exit Recorded</span>
            <strong>{exitLogs.length}</strong>
          </div>
        </div>

        <div className="exit-summary-card">
          <div className="exit-summary-icon blue">⏱</div>
          <div>
            <span>Latest Exit</span>
            <strong>{exitLogs[0]?.exit || "--"}</strong>
          </div>
        </div>
      </div>

      <div className="exit-logs-card">
        <div className="exit-logs-card-header">
          <div>
            <h3>Exit Records</h3>
            <p>Visitors who left the society</p>
          </div>

          <div className="exit-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search visitor, flat or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="exit-table-wrapper">
          {loading ? (
            <div className="no-exit-logs">
              Loading exit records...
            </div>
          ) : error ? (
            <div className="no-exit-logs">
              <strong>{error}</strong>
              <button onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <table className="exit-table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Flat</th>
                    <th>Purpose</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>Duration</th>
                    <th>QR ID</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={log.id ?? index}>
                      <td>
                        <div className="exit-visitor">
                          <div className="exit-avatar">
                            {String(log.visitor).charAt(0)}
                          </div>
                          <div>
                            <strong>{log.visitor}</strong>
                            <span>{log.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong className="exit-flat">
                          {log.flat || "--"}
                        </strong>
                      </td>
                      <td>{log.purpose || "--"}</td>
                      <td>{log.entry}</td>
                      <td>
                        <strong className="exit-time">
                          {log.exit}
                        </strong>
                      </td>
                      <td>{log.duration}</td>
                      <td>
                        <span className="exit-qr-badge">
                          {log.qr}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div className="no-exit-logs">
                  <div>⌕</div>
                  <strong>
                    {exitLogs.length === 0
                      ? "No exit records in the database"
                      : "No exit records found"}
                  </strong>
                  <p>
                    {exitLogs.length === 0
                      ? "Records will appear after exits are saved by the backend."
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

export default ExitLogs;
