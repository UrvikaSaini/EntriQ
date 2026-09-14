function StatIcon({ type }) {

  if (type === "parking") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M6 19V5h7a4 4 0 0 1 0 8H9" />
        <path d="M9 9h4a1 1 0 0 0 0-2H9v2Z" />
      </svg>
    );
  }

  if (type === "visitor") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
      </svg>
    );
  }

  if (type === "complaint") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}


function Admin({ slots, complaints }) {

  const totalSlots = slots.length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status === "Occupied"
  ).length;

  const availableSlots = slots.filter(
    (slot) => slot.status === "Available"
  ).length;

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolvedComplaints = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;


  /*
    Read visitor information without changing
    your teammate's code.
  */

  function getVisitorData() {

    const possibleKeys = [
      "visitors",
      "visitorLogs",
      "visitorRequests",
      "visitorData"
    ];

    for (const key of possibleKeys) {

      const data = localStorage.getItem(key);

      if (data) {

        try {

          const parsedData = JSON.parse(data);

          if (Array.isArray(parsedData)) {
            return parsedData;
          }

        } catch {
          return [];
        }

      }

    }

    return [];
  }


  const visitors = getVisitorData();

  const totalVisitors = visitors.length;


  return (

    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Overview of your society activity and management.
          </p>
        </div>

        <div className="admin-badge">
          ADMIN
        </div>

      </div>


      {/* STAT CARDS */}

      <div className="admin-stats">


        <div className="admin-stat-card">

          <div className="admin-stat-icon parking-icon">
            <StatIcon type="parking" />
          </div>

          <div>
            <p>Total Parking</p>
            <h2>{totalSlots}</h2>
          </div>

          <span className="stat-label">
            Slots
          </span>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon occupied-icon">
            <StatIcon type="parking" />
          </div>

          <div>
            <p>Occupied</p>
            <h2>{occupiedSlots}</h2>
          </div>

          <span className="stat-label">
            {totalSlots === 0
              ? 0
              : Math.round(
                  (occupiedSlots / totalSlots) * 100
                )}%
          </span>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon visitor-icon">
            <StatIcon type="visitor" />
          </div>

          <div>
            <p>Total Visitors</p>
            <h2>{totalVisitors}</h2>
          </div>

          <span className="stat-label">
            Logged
          </span>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon complaint-icon">
            <StatIcon type="complaint" />
          </div>

          <div>
            <p>Complaints</p>
            <h2>{totalComplaints}</h2>
          </div>

          <span className="stat-label">
            Total
          </span>

        </div>

      </div>


      {/* OVERVIEW */}

      <div className="admin-content-grid">


        {/* PARKING OVERVIEW */}

        <div className="admin-panel">

          <div className="panel-header">

            <div>
              <h2>Parking Overview</h2>

              <p>
                Current parking availability
              </p>
            </div>

            <div className="panel-small-icon">
              <StatIcon type="parking" />
            </div>

          </div>


          <div className="parking-progress">

            <div className="progress-info">

              <span>Occupied</span>

              <strong>
                {occupiedSlots} / {totalSlots}
              </strong>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width:
                    totalSlots === 0
                      ? "0%"
                      : `${(occupiedSlots / totalSlots) * 100}%`
                }}
              />

            </div>

          </div>


          <div className="parking-numbers">

            <div>
              <span className="dot red-dot"></span>
              Occupied
              <strong>{occupiedSlots}</strong>
            </div>

            <div>
              <span className="dot green-dot"></span>
              Available
              <strong>{availableSlots}</strong>
            </div>

          </div>

        </div>


        {/* COMPLAINT OVERVIEW */}

        <div className="admin-panel">

          <div className="panel-header">

            <div>
              <h2>Complaint Overview</h2>

              <p>
                Current complaint status
              </p>
            </div>

            <div className="panel-small-icon">
              <StatIcon type="complaint" />
            </div>

          </div>


          <div className="complaint-summary">

            <div className="summary-row">

              <span>
                Pending Complaints
              </span>

              <strong className="pending-number">
                {pendingComplaints}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Resolved Complaints
              </span>

              <strong className="resolved-number">
                {resolvedComplaints}
              </strong>

            </div>


            <div className="summary-row total-row">

              <span>
                Total Complaints
              </span>

              <strong>
                {totalComplaints}
              </strong>

            </div>

          </div>

        </div>


        {/* VISITOR PANEL */}

        <div className="admin-panel visitor-panel">

          <div className="panel-header">

            <div>
              <h2>Visitor Activity</h2>

              <p>
                Visitor information from the system
              </p>
            </div>

            <div className="panel-small-icon">
              <StatIcon type="visitor" />
            </div>

          </div>


          <div className="visitor-big-number">
            {totalVisitors}
          </div>

          <p className="visitor-caption">
            Total visitors recorded
          </p>


          {visitors.length > 0 ? (

            <div className="recent-visitors">

              <h3>Recent Visitors</h3>

              {visitors.slice(-3).reverse().map(
                (visitor, index) => (

                  <div
                    className="visitor-row"
                    key={index}
                  >

                    <div className="visitor-avatar">
                      {(visitor.name || "V")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <strong>
                        {visitor.name || "Visitor"}
                      </strong>

                      <p>
                        {visitor.flatNo ||
                          visitor.flat ||
                          "Society Visitor"}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="no-visitor-data">
              No visitor records available yet.
            </div>

          )}

        </div>


        {/* SYSTEM SUMMARY */}

        <div className="admin-panel">

          <div className="panel-header">

            <div>
              <h2>Society Summary</h2>

              <p>
                Quick system overview
              </p>
            </div>

            <div className="panel-small-icon">
              <StatIcon type="clock" />
            </div>

          </div>


          <div className="summary-list">

            <div>
              <span>Parking utilization</span>

              <strong>
                {totalSlots === 0
                  ? 0
                  : Math.round(
                      (occupiedSlots / totalSlots) * 100
                    )}%
              </strong>
            </div>

            <div>
              <span>Available parking</span>

              <strong>
                {availableSlots}
              </strong>
            </div>

            <div>
              <span>Pending issues</span>

              <strong>
                {pendingComplaints}
              </strong>
            </div>

            <div>
              <span>Resolved issues</span>

              <strong>
                {resolvedComplaints}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Admin;