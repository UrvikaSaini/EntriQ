import { useState } from "react";
import "./ParkingComplaints.css";

function ComplaintIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

function Complaints({ complaints, setComplaints, role }) {

  const [name, setName] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [complaint, setComplaint] = useState("");

  // Validation errors
  const [nameError, setNameError] = useState("");
  const [flatError, setFlatError] = useState("");
  const [complaintError, setComplaintError] = useState("");

  function addComplaint() {

    // Clear old errors
    setNameError("");
    setFlatError("");
    setComplaintError("");

    let valid = true;

    // Name validation
    if (name.trim() === "") {
      setNameError("Please enter your name");
      valid = false;
    }

    // Flat number validation
    if (flatNo.trim() === "") {
      setFlatError("Please enter your flat number");
      valid = false;
    }

    // Complaint validation
    if (complaint.trim() === "") {
      setComplaintError("Please enter your complaint");
      valid = false;
    } 
    else if (complaint.trim().length < 5) {
      setComplaintError("Complaint must be at least 5 characters");
      valid = false;
    }

    // Stop if validation fails
    if (!valid) {
      return;
    }

    const newComplaint = {
      id: Date.now(),
      name: name.trim(),
      flatNo: flatNo.trim().toUpperCase(),
      complaint: complaint.trim(),
      status: "Pending"
    };

    setComplaints([...complaints, newComplaint]);

    // Clear form
    setName("");
    setFlatNo("");
    setComplaint("");
  }

  function resolveComplaint(id) {

    if (role !== "admin") {
      return;
    }

    const updatedComplaints = complaints.map((item) => {

      if (item.id === id) {
        return {
          ...item,
          status: "Resolved"
        };
      }

      return item;
    });

    setComplaints(updatedComplaints);
  }

  return (
    <div className="complaints-page">

      {/* PAGE HEADER */}

      <div className="page-header">
        <h1>Complaints</h1>

        <p>
          Report and track issues in your society.
        </p>
      </div>


      {/* GRIEVANCE BANNER */}

      <div className="grievance-banner">

        <div className="banner-content">

          <span className="banner-label">
            GRIEVANCE MANAGEMENT
          </span>

          <h2>
            Your voice matters.
            <br />
            <span>We're here to help.</span>
          </h2>

          <p>
            Raise complaints, track status and get timely resolution.
          </p>

        </div>

        <div className="banner-icon">
          <ComplaintIcon />
        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="complaints-layout">

        {/* FORM */}

        <div className="complaint-form-card">

          <div className="card-heading">

            <div className="heading-icon">
              <ComplaintIcon />
            </div>

            <div>
              <h2>Submit a Complaint</h2>

              <p>
                Fill in the details to raise your concern.
              </p>
            </div>

          </div>


          {/* NAME */}

          <div className="form-field">

            <label>Your Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />

            {nameError && (
              <p className="field-error">
                ⚠ {nameError}
              </p>
            )}

          </div>


          {/* FLAT NUMBER */}

          <div className="form-field">

            <label>Flat Number</label>

            <input
              type="text"
              placeholder="e.g. A-204"
              value={flatNo}
              onChange={(e) => {
                setFlatNo(e.target.value);
                setFlatError("");
              }}
            />

            {flatError && (
              <p className="field-error">
                ⚠ {flatError}
              </p>
            )}

          </div>


          {/* COMPLAINT */}

          <div className="form-field">

            <label>Complaint</label>

            <textarea
              placeholder="Describe your issue..."
              value={complaint}
              onChange={(e) => {
                setComplaint(e.target.value);
                setComplaintError("");
              }}
            />

            {complaintError && (
              <p className="field-error">
                ⚠ {complaintError}
              </p>
            )}

          </div>


          {/* SUBMIT BUTTON */}

          <button
            className="submit-complaint-btn"
            onClick={addComplaint}
          >
            <span>➤</span>
            Submit Complaint
          </button>

        </div>


        {/* COMPLAINT LIST */}

        <div className="complaints-list-card">

          <div className="card-heading">

            <div className="heading-icon">
              <ComplaintIcon />
            </div>

            <div>
              <h2>Complaints</h2>

              <p>
                Track the status of submitted complaints.
              </p>
            </div>

          </div>


          <div className="complaints-list">

            {complaints.length === 0 ? (

              <div className="empty-complaints">
                No complaints submitted yet.
              </div>

            ) : (

              complaints.map((item) => (

                <div
                  className="complaint-item"
                  key={item.id}
                >

                  <div className="complaint-item-icon">
                    <ComplaintIcon />
                  </div>


                  <div className="complaint-info">

                    <h3>
                      {item.complaint}
                    </h3>

                    <p>
                      {item.name}
                      <span> • </span>
                      Flat {item.flatNo}
                    </p>

                  </div>


                  <div className="complaint-right">

                    <span
                      className={`status-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>


                    {role === "admin" &&
                      item.status === "Pending" && (

                        <button
                          className="resolve-btn"
                          onClick={() =>
                            resolveComplaint(item.id)
                          }
                        >
                          Resolve
                        </button>

                    )}

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Complaints;