import { useState } from "react";
import "./VisitorVerification.css";

function VisitorVerification() {
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [flat, setFlat] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const [visitor, setVisitor] = useState(null);
  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState("");
  const [errors, setErrors] = useState({});

  // Dummy resident approval data
  const approvedVisitors = {
    "Rahul Sharma": {
      resident: "Aman Sharma",
      flat: "A-204",
      approval: "Approved",
    },
    "Priya Mehta": {
      resident: "Neha Mehta",
      flat: "B-102",
      approval: "Approved",
    },
  };

  // FORM VALIDATION
  const handleVerify = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Visitor Name validation
    if (!visitorName.trim()) {
      newErrors.visitorName = "Visitor name is required.";
    } else if (!/^[A-Za-z ]+$/.test(visitorName.trim())) {
      newErrors.visitorName =
        "Name can contain only letters and spaces.";
    } else if (visitorName.trim().length < 2) {
      newErrors.visitorName =
        "Name must contain at least 2 characters.";
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian phone number.";
    }

    // Flat number validation
    if (!flat.trim()) {
      newErrors.flat = "Flat number is required.";
    } else if (!/^[A-Za-z]-\d{3}$/.test(flat.trim())) {
      newErrors.flat =
        "Enter a valid flat number, e.g. A-204.";
    }

    // Purpose validation
    if (!purpose) {
      newErrors.purpose =
        "Please select the purpose of visit.";
    }

    // Vehicle number validation
    // Optional field
    if (
      vehicleNumber.trim() &&
      !/^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/.test(
        vehicleNumber.replace(/\s/g, "").toUpperCase()
      )
    ) {
      newErrors.vehicleNumber =
        "Enter a valid vehicle number, e.g. PB11AB1234.";
    }

    // Set validation errors
    setErrors(newErrors);

    setMessage("");
    setDecision("");

    // Stop if there are errors
    if (Object.keys(newErrors).length > 0) {
      setVisitor(null);
      return;
    }

    // Check approved visitor
    const existingVisitor =
      approvedVisitors[visitorName.trim()];

    // Set visitor data
    setVisitor({
      name: visitorName.trim(),
      phone: phone,
      flat: flat.trim().toUpperCase(),
      purpose: purpose,
      vehicle: vehicleNumber.trim()
        ? vehicleNumber.trim().toUpperCase()
        : "No vehicle",
      resident: existingVisitor
        ? existingVisitor.resident
        : "Resident not found",
      approval: existingVisitor
        ? existingVisitor.approval
        : "Pending",
    });

    setMessage("");
  };

  // ALLOW ENTRY
  const handleAllowEntry = () => {
    setDecision("allowed");

    setMessage(
      `${visitor.name} has been allowed to enter the society.`
    );
  };

  // DENY ENTRY
  const handleDenyEntry = () => {
    setDecision("denied");

    setMessage(
      `${visitor.name}'s entry has been denied.`
    );
  };

  // RESET
  const handleReset = () => {
    setVisitorName("");
    setPhone("");
    setFlat("");
    setPurpose("");
    setVehicleNumber("");

    setVisitor(null);
    setMessage("");
    setDecision("");
    setErrors({});
  };

  return (
    <section className="visitor-page">

      {/* HEADER */}

      <div className="visitor-page-header">

        <div>

          <span className="visitor-label">
            SECURITY VERIFICATION
          </span>

          <h2>Visitor Verification</h2>

          <p>
            Verify visitors who arrive without a QR pass.
          </p>

        </div>

        <div className="visitor-status-ready">
          <span></span>
          Gate Verification
        </div>

      </div>


      {/* MAIN LAYOUT */}

      <div className="visitor-layout">

        {/* LEFT - FORM */}

        <div className="visitor-form-card">

          <div className="visitor-card-header">

            <div>

              <h3>Visitor Details</h3>

              <p>
                Enter the visitor information for verification.
              </p>

            </div>

            <div className="visitor-card-icon">
              ♙
            </div>

          </div>


          <form onSubmit={handleVerify}>

            {/* NAME */}

            <div className="visitor-form-group">

              <label>
                Visitor Name <span>*</span>
              </label>

              <input
                type="text"
                placeholder="Enter visitor name"
                value={visitorName}
                onChange={(e) =>
                  setVisitorName(e.target.value)
                }
                className={
                  errors.visitorName
                    ? "input-error"
                    : ""
                }
              />

              {errors.visitorName && (
                <small className="field-error">
                  {errors.visitorName}
                </small>
              )}

            </div>


            {/* PHONE */}

            <div className="visitor-form-group">

              <label>
                Phone Number <span>*</span>
              </label>

              <input
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                maxLength="10"
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setPhone(value);
                }}
                className={
                  errors.phone
                    ? "input-error"
                    : ""
                }
              />

              {errors.phone && (
                <small className="field-error">
                  {errors.phone}
                </small>
              )}

            </div>


            {/* FLAT */}

            <div className="visitor-form-group">

              <label>
                Resident / Flat Number <span>*</span>
              </label>

              <input
                type="text"
                placeholder="Example: A-204"
                value={flat}
                onChange={(e) =>
                  setFlat(
                    e.target.value.toUpperCase()
                  )
                }
                className={
                  errors.flat
                    ? "input-error"
                    : ""
                }
              />

              {errors.flat && (
                <small className="field-error">
                  {errors.flat}
                </small>
              )}

            </div>


            {/* PURPOSE */}

            <div className="visitor-form-group">

              <label>
                Purpose of Visit <span>*</span>
              </label>

              <select
                value={purpose}
                onChange={(e) =>
                  setPurpose(e.target.value)
                }
                className={
                  errors.purpose
                    ? "input-error"
                    : ""
                }
              >

                <option value="">
                  Select purpose
                </option>

                <option value="Guest Visit">
                  Guest Visit
                </option>

                <option value="Family Visit">
                  Family Visit
                </option>

                <option value="Personal Visit">
                  Personal Visit
                </option>

                <option value="Delivery">
                  Delivery
                </option>

                <option value="Service Provider">
                  Service Provider
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              {errors.purpose && (
                <small className="field-error">
                  {errors.purpose}
                </small>
              )}

            </div>


            {/* VEHICLE */}

            <div className="visitor-form-group">

              <label>
                Vehicle Number
                <small> (Optional)</small>
              </label>

              <input
                type="text"
                placeholder="Example: PB11AB1234"
                value={vehicleNumber}
                maxLength="10"
                onChange={(e) =>
                  setVehicleNumber(
                    e.target.value.toUpperCase()
                  )
                }
                className={
                  errors.vehicleNumber
                    ? "input-error"
                    : ""
                }
              />

              {errors.vehicleNumber && (
                <small className="field-error">
                  {errors.vehicleNumber}
                </small>
              )}

            </div>


            {/* BUTTONS */}

            <div className="visitor-form-buttons">

              <button
                type="submit"
                className="visitor-verify-button"
              >
                ✓ Verify Visitor
              </button>

              <button
                type="button"
                className="visitor-reset-button"
                onClick={handleReset}
              >
                Reset
              </button>

            </div>

          </form>


          {/* MESSAGE */}

          {message && (

            <div
              className={`visitor-message ${
                decision === "allowed"
                  ? "success"
                  : decision === "denied"
                  ? "denied"
                  : "error"
              }`}
            >

              <span>
                {decision === "allowed"
                  ? "✓"
                  : decision === "denied"
                  ? "×"
                  : "!"}
              </span>

              <p>{message}</p>

            </div>

          )}

        </div>


        {/* RIGHT - RESULT */}

        <div className="visitor-result-card">

          <div className="visitor-result-header">

            <div>

              <h3>Verification Result</h3>

              <p>
                Resident approval and visitor details
              </p>

            </div>

          </div>


          {/* EMPTY STATE */}

          {!visitor && (

            <div className="visitor-empty">

              <div className="visitor-empty-icon">
                ♙
              </div>

              <strong>
                No Visitor Selected
              </strong>

              <p>
                Enter visitor details and click
                <br />
                "Verify Visitor".
              </p>

            </div>

          )}


          {/* RESULT */}

          {visitor && (

            <div className="visitor-result">

              <div className="visitor-verified-icon">
                ✓
              </div>

              <h3>
                Visitor Verification
              </h3>

              <p className="visitor-result-subtitle">
                Visitor details have been checked.
              </p>


              {/* VISITOR DETAILS */}

              <div className="visitor-detail-list">

                <div className="visitor-detail">

                  <span>
                    Visitor Name
                  </span>

                  <strong>
                    {visitor.name}
                  </strong>

                </div>


                <div className="visitor-detail">

                  <span>
                    Phone Number
                  </span>

                  <strong>
                    {visitor.phone}
                  </strong>

                </div>


                <div className="visitor-detail">

                  <span>
                    Flat Number
                  </span>

                  <strong>
                    {visitor.flat}
                  </strong>

                </div>


                <div className="visitor-detail">

                  <span>
                    Purpose
                  </span>

                  <strong>
                    {visitor.purpose}
                  </strong>

                </div>


                <div className="visitor-detail">

                  <span>
                    Vehicle
                  </span>

                  <strong>
                    {visitor.vehicle}
                  </strong>

                </div>

              </div>


              {/* RESIDENT APPROVAL */}

              <div className="resident-approval">

                <div className="approval-header">

                  <span>
                    Resident Approval
                  </span>

                  <strong
                    className={
                      visitor.approval === "Approved"
                        ? "approval-approved"
                        : "approval-pending"
                    }
                  >
                    {visitor.approval}
                  </strong>

                </div>


                <div className="approval-details">

                  <span>
                    Resident
                  </span>

                  <strong>
                    {visitor.resident}
                  </strong>

                </div>


                <div className="approval-details">

                  <span>
                    Flat
                  </span>

                  <strong>
                    {visitor.flat}
                  </strong>

                </div>

              </div>


              {/* ACTION BUTTONS */}

              {visitor.approval === "Approved" &&
                !decision && (

                  <div className="visitor-decision-buttons">

                    <button
                      className="allow-visitor-button"
                      onClick={handleAllowEntry}
                    >
                      ✓ Allow Entry
                    </button>

                    <button
                      className="deny-visitor-button"
                      onClick={handleDenyEntry}
                    >
                      × Deny Entry
                    </button>

                  </div>

                )}


              {/* PENDING */}

              {visitor.approval === "Pending" && (

                <div className="pending-approval">

                  <span>◷</span>

                  <div>

                    <strong>
                      Resident Approval Pending
                    </strong>

                    <p>
                      Entry should not be allowed until
                      resident approval is received.
                    </p>

                  </div>

                </div>

              )}


              {/* FINAL STATUS */}

              {decision === "allowed" && (

                <div className="final-entry-status">

                  <span>✓</span>

                  <div>

                    <strong>
                      Entry Allowed
                    </strong>

                    <small>
                      Visitor may enter the society.
                    </small>

                  </div>

                </div>

              )}


              {decision === "denied" && (

                <div className="final-denied-status">

                  <span>×</span>

                  <div>

                    <strong>
                      Entry Denied
                    </strong>

                    <small>
                      Visitor has not been allowed to enter.
                    </small>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      </div>


      {/* SECURITY NOTE */}

      <div className="visitor-security-note">

        <div className="visitor-security-icon">
          🔒
        </div>

        <div>

          <strong>
            Security Reminder
          </strong>

          <p>
            Always confirm visitor details and resident
            approval before allowing entry.
          </p>

        </div>

      </div>

    </section>
  );
}

export default VisitorVerification;