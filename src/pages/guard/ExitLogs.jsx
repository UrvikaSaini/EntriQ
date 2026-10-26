import { useState } from "react";
import "./ExitLogs.css";

function ExitLogs() {
  const [search, setSearch] = useState("");

  
const [exitLogs] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("entriqExitLogs") || "[]"
    );
  } catch {
    return [];
  }
});


  const filteredLogs = exitLogs.filter(
    (log) =>
      log.visitor.toLowerCase().includes(search.toLowerCase()) ||
      log.flat.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="exit-logs-page">

      {/* HEADER */}
      <div className="exit-logs-header">

        <div>
          <span className="exit-label">
            SECURITY RECORDS
          </span>

          <h2>Exit Logs</h2>

          <p>
            Track visitors who have exited the society.
          </p>
        </div>

        <div className="exit-date">
          <span>Today's Exits</span>
          <strong>{exitLogs.length}</strong>
        </div>

      </div>


      {/* SUMMARY */}
      <div className="exit-summary">

        <div className="exit-summary-card">

          <div className="exit-summary-icon">
            ↗
          </div>

          <div>
            <span>Total Exits</span>
            <strong>{exitLogs.length}</strong>
          </div>

        </div>

        <div className="exit-summary-card">

          <div className="exit-summary-icon green">
            ✓
          </div>

          <div>
            <span>Exit Recorded</span>
            <strong>{exitLogs.length}</strong>
          </div>

        </div>

        <div className="exit-summary-card">

          <div className="exit-summary-icon blue">
            ⏱
          </div>

          <div>
            <span>Latest Exit</span>
            <strong>{exitLogs[0]?.exit || "--"}</strong>
          </div>

        </div>

      </div>


      {/* LOG TABLE */}
      <div className="exit-logs-card">

        <div className="exit-logs-card-header">

          <div>
            <h3>Today's Exit Records</h3>

            <p>
              Visitors who left the society today
            </p>
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

              {filteredLogs.map((log) => (

                <tr key={log.id}>

                  <td>

                    <div className="exit-visitor">

                      <div className="exit-avatar">
                        {log.visitor.charAt(0)}
                      </div>

                      <div>
                        <strong>{log.visitor}</strong>
                        <span>{log.id}</span>
                      </div>

                    </div>

                  </td>

                  <td>
                    <strong className="exit-flat">
                      {log.flat}
                    </strong>
                  </td>

                  <td>
                    {log.purpose}
                  </td>

                  <td>
                    {log.entry}
                  </td>

                  <td>
                    <strong className="exit-time">
                      {log.exit}
                    </strong>
                  </td>

                  <td>
                    {log.duration}
                  </td>

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
                No exit records found
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

export default ExitLogs;

