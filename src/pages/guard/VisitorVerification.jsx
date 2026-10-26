import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./VisitorVerification.css";
import { guardApi } from "../../services/guardApi";

function VisitorVerification() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "pending-requests") {
      const timer = setTimeout(() => {
        document
          .getElementById("pending-requests")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.key, location.state]);
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [flat, setFlat] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const [visitor, setVisitor] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [requests, setRequests] = useState([]);

  const getRequests = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("entriqVisitorRequests") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };

  const getEntryLogs = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("entriqEntryLogs") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };

  const normalizeStatus = (status) => {
    const value = String(status || "Pending").toLowerCase();

    if (value === "approved") return "Approved";
    if (value === "entered") return "Entered";
    if (value === "denied" || value === "rejected") return "Denied";

    return "Pending";
  };

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const loadRequests = async () => {
    try {
      const response = await guardApi.getVisitors();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.visitors || [];

      const entryLogs = getEntryLogs();

      const savedRequests = data.map((v) => {
        const databaseStatus = normalizeStatus(v.status);

        const entryRecord = entryLogs.find(
          (entry) =>
            String(entry.visitorId ?? entry.id) === String(v.id)
        );

        const status = entryRecord ? "Entered" : databaseStatus;

        return {
          ...v,
          name: v.visitor_name || v.name,
          phone: v.phone,
          flat: v.flat_number || v.flat,
          purpose: v.purpose,
          vehicle: v.vehicle_number || v.vehicle || "No vehicle",
          approval: databaseStatus,
          status,
          entry: entryRecord?.entry || v.entry,
          createdAt: v.created_at || v.createdAt,
        };
      });

      setRequests(savedRequests);

      setSelectedRequest((current) => {
        if (!current) return null;

        return (
          savedRequests.find(
            (request) => String(request.id) === String(current.id)
          ) || null
        );
      });

      setVisitor((current) => {
        if (!current) return null;

        return (
          savedRequests.find(
            (request) => String(request.id) === String(current.id)
          ) || current
        );
      });
    } catch (error) {
      console.error("Failed to load visitor requests:", error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleVerify = async (event) => {
    event.preventDefault();

    if (
      !visitorName.trim() ||
      !phone.trim() ||
      !flat.trim() ||
      !purpose.trim()
    ) {
      showMessage("Please fill in all required fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      showMessage("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await guardApi.createVisitor({
        visitorName: visitorName.trim(),
        phone: phone.trim(),
        flatNumber: flat.trim().toUpperCase(),
        purpose: purpose.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
      });

      setVisitor(response.data.visitor);

      await loadRequests();

      showMessage(
        "Visitor request submitted. Waiting for resident approval.",
        "success"
      );

      setVisitorName("");
      setPhone("");
      setFlat("");
      setPurpose("");
      setVehicleNumber("");
    } catch (error) {
      console.error("Visitor registration failed:", error);

      showMessage(
        error.response?.data?.message ||
          "Could not save visitor. Please check the backend.",
        "error"
      );
    }
  };

  const handleRefreshApproval = async () => {
    if (!visitor) return;

    try {
      const response = await guardApi.getVisitor(visitor.id);
      const updatedVisitor = response.data.visitor;

      setVisitor(updatedVisitor);
      await loadRequests();

      const status = normalizeStatus(
        updatedVisitor.approval || updatedVisitor.status
      );

      if (status === "Approved") {
        showMessage("Resident has approved this visitor.", "success");
      } else if (status === "Denied") {
        showMessage("Resident has rejected this visitor.", "denied");
      } else {
        showMessage("Resident approval is still pending.", "pending");
      }
    } catch (error) {
      console.error("Could not refresh visitor:", error);

      showMessage(
        "Could not refresh approval. Check the backend.",
        "error"
      );
    }
  };

  const handleAllowEntry = (requestToAllow = visitor) => {
    if (!requestToAllow) return;

    const visitorId = requestToAllow.id;

    const approval = normalizeStatus(
      requestToAllow.approval || requestToAllow.status
    );

    if (approval !== "Approved") {
      showMessage(
        "Resident approval is required before allowing entry."
      );
      return;
    }

    if (normalizeStatus(requestToAllow.status) === "Entered") {
      showMessage("This visitor's entry is already recorded.");
      return;
    }

    if (normalizeStatus(requestToAllow.status) === "Denied") {
      showMessage("Entry has been denied for this visitor.");
      return;
    }

    const entries = getEntryLogs();

    if (
      entries.some(
        (entry) =>
          String(entry.visitorId ?? entry.id) === String(visitorId)
      )
    ) {
      showMessage("This visitor's entry is already recorded.");
      return;
    }

    const entryTime = new Date().toISOString();

    const entryRecord = {
      ...requestToAllow,
      id: visitorId,
      visitor: requestToAllow.name || requestToAllow.visitor_name,
      entry: entryTime,
      timestamp: entryTime,
      status: "Entered",
    };

    entries.push(entryRecord);

    localStorage.setItem("entriqEntryLogs", JSON.stringify(entries));

    const updatedVisitor = {
      ...requestToAllow,
      status: "Entered",
      entry: entryTime,
    };

    setVisitor((current) =>
      current && String(current.id) === String(visitorId)
        ? { ...current, ...updatedVisitor }
        : current
    );

    setSelectedRequest((current) =>
      current && String(current.id) === String(visitorId)
        ? { ...current, ...updatedVisitor }
        : current
    );

    setRequests((current) =>
      current.map((request) =>
        String(request.id) === String(visitorId)
          ? { ...request, ...updatedVisitor }
          : request
      )
    );

    const localRequests = getRequests().map((request) =>
      String(request.id) === String(visitorId)
        ? { ...request, status: "Entered", entry: entryTime }
        : request
    );

    localStorage.setItem(
      "entriqVisitorRequests",
      JSON.stringify(localRequests)
    );

    showMessage("Visitor entry recorded successfully.", "success");
  };

  const handleDenyEntry = async (requestToDeny = visitor) => {
    if (!requestToDeny) return;

    const visitorId = requestToDeny.id;
    const currentStatus = normalizeStatus(requestToDeny.status);

    if (currentStatus === "Entered") {
      showMessage("This visitor has already entered.");
      return;
    }

    if (currentStatus === "Denied") {
      showMessage("Entry has already been denied.", "denied");
      return;
    }

    try {
      await guardApi.rejectVisitor(visitorId);

      const deniedVisitor = {
        ...requestToDeny,
        approval: "Denied",
        status: "Denied",
        decisionAt: new Date().toISOString(),
      };

      setVisitor((current) =>
        current && String(current.id) === String(visitorId)
          ? { ...current, ...deniedVisitor }
          : current
      );

      setSelectedRequest((current) =>
        current && String(current.id) === String(visitorId)
          ? { ...current, ...deniedVisitor }
          : current
      );

      setRequests((current) =>
        current.map((request) =>
          String(request.id) === String(visitorId)
            ? { ...request, ...deniedVisitor }
            : request
        )
      );

      const localRequests = getRequests().map((request) =>
        String(request.id) === String(visitorId)
          ? { ...request, ...deniedVisitor }
          : request
      );

      localStorage.setItem(
        "entriqVisitorRequests",
        JSON.stringify(localRequests)
      );

      showMessage("Entry denied for this visitor.", "denied");

      await loadRequests();
    } catch (error) {
      console.error("Could not deny visitor entry:", error);

      showMessage(
        error.response?.data?.message ||
          "Could not update visitor status. Check the backend.",
        "error"
      );
    }
  };

  // Delete only denied requests
  const handleDeleteRequest = async (requestToDelete) => {
    if (!requestToDelete) return;

    if (normalizeStatus(requestToDelete.status) !== "Denied") {
      showMessage("Only denied requests can be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this denied visitor request?"
    );

    if (!confirmed) return;

    const visitorId = requestToDelete.id;

    try {
      // This must delete the record from the backend database.
      await guardApi.deleteVisitor(visitorId);

      // Immediately remove it from the visible list.
      setRequests((current) =>
        current.filter(
          (request) => String(request.id) !== String(visitorId)
        )
      );

      setSelectedRequest((current) =>
        current && String(current.id) === String(visitorId)
          ? null
          : current
      );

      setVisitor((current) =>
        current && String(current.id) === String(visitorId)
          ? null
          : current
      );

      // Also remove it from local storage.
      localStorage.setItem(
        "entriqVisitorRequests",
        JSON.stringify(
          getRequests().filter(
            (request) => String(request.id) !== String(visitorId)
          )
        )
      );

      showMessage("Denied visitor request deleted.", "success");
    } catch (error) {
      console.error("Could not delete visitor request:", error);

      showMessage(
        error.response?.data?.message ||
          "Could not delete the request. Check the backend delete endpoint.",
        "error"
      );
    }
  };

  const handleReset = () => {
    setVisitorName("");
    setPhone("");
    setFlat("");
    setPurpose("");
    setVehicleNumber("");
    setVisitor(null);
    setMessage("");
    setMessageType("");
  };

  const approvalStatus = visitor
    ? ["Entered", "Denied"].includes(normalizeStatus(visitor.status))
      ? normalizeStatus(visitor.status)
      : normalizeStatus(visitor.approval || visitor.status)
    : "Pending";

  const isApproved =
    normalizeStatus(visitor?.approval || visitor?.status) === "Approved";

  const isDenied = approvalStatus === "Denied";
  const isEntered = approvalStatus === "Entered";

  const selectedApproval = selectedRequest
    ? ["Entered", "Denied"].includes(
        normalizeStatus(selectedRequest.status)
      )
      ? normalizeStatus(selectedRequest.status)
      : normalizeStatus(
          selectedRequest.approval || selectedRequest.status
        )
    : "Pending";

  const getRequestStatusClass = (status) => {
    const normalized = String(status).toLowerCase();

    if (normalized === "approved") return "request-status-approved";
    if (normalized === "entered") return "request-status-entered";
    if (normalized === "denied" || normalized === "rejected") {
      return "request-status-denied";
    }

    return "request-status-pending";
  };

  return (
    <div className="visitor-page">
      <div className="visitor-page-header">
        <div>
          <span className="visitor-label">VISITOR MANAGEMENT</span>
          <h2>Visitor Verification</h2>
          <p>Register visitors and check resident approval.</p>
        </div>

        <div className="visitor-status-ready">
          <span></span>
          Guard Portal
        </div>
      </div>

      <div className="visitor-layout">
        <div className="visitor-form-card">
          <div className="visitor-card-header">
            <div>
              <h3>Visitor Details</h3>
              <p>Enter the visitor's information below.</p>
            </div>
            <div className="visitor-card-icon">♙</div>
          </div>

          <form onSubmit={handleVerify}>
            <div className="visitor-form-group">
              <label>
                Visitor Name <span>*</span>
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="visitor-form-group">
              <label>
                Phone Number <span>*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit number"
                maxLength={10}
                required
              />
            </div>

            <div className="visitor-form-group">
              <label>
                Flat Number <span>*</span>
              </label>
              <input
                type="text"
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                placeholder="Example: A-204"
                required
              />
            </div>

            <div className="visitor-form-group">
              <label>
                Purpose of Visit <span>*</span>
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              >
                <option value="">Select purpose</option>
                <option value="Guest Visit">Guest Visit</option>
                <option value="Family Visit">Family Visit</option>
                <option value="Delivery">Delivery</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Personal Visit">Personal Visit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="visitor-form-group">
              <label>
                Vehicle Number <small>(Optional)</small>
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Enter vehicle number"
              />
            </div>

            <div className="visitor-form-buttons">
              <button type="submit" className="visitor-verify-button">
                Submit for Approval
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

          {message && (
            <div className={`visitor-message ${messageType}`}>
              <span>{messageType === "success" ? "✓" : "!"}</span>
              <p>{message}</p>
            </div>
          )}
        </div>

        <div className="visitor-result-card">
          <div className="visitor-result-header">
            <div>
              <h3>Verification Result</h3>
              <p>Visitor request and entry status.</p>
            </div>
            <div className="visitor-card-icon">✓</div>
          </div>

          {!visitor ? (
            <div className="visitor-empty">
              <div className="visitor-empty-icon">♙</div>
              <strong>No Visitor Selected</strong>
              <p>
                Submit the visitor details to create a request.
                <br />
                The request status will appear here.
              </p>
            </div>
          ) : (
            <div className="visitor-result">
              <div
                className="visitor-verified-icon"
                style={
                  isDenied
                    ? {
                        background: "#FBEAEA",
                        color: "#B22222",
                        borderColor: "#E5C5C5",
                      }
                    : {}
                }
              >
                {isDenied ? "✕" : isEntered ? "✓" : "!"}
              </div>

              <h3>
                {isEntered
                  ? "Entry Recorded"
                  : isDenied
                  ? "Entry Denied"
                  : isApproved
                  ? "Resident Approved"
                  : "Request Submitted"}
              </h3>

              <p className="visitor-result-subtitle">
                {isEntered
                  ? "This visitor's entry has been recorded."
                  : isDenied
                  ? "This visitor's entry request was denied."
                  : isApproved
                  ? "The resident has approved this visitor."
                  : "Waiting for the resident to respond."}
              </p>

              <div className="visitor-detail-list">
                <div className="visitor-detail">
                  <span>Visitor Name</span>
                  <strong>{visitor.name || visitor.visitor_name}</strong>
                </div>

                <div className="visitor-detail">
                  <span>Phone Number</span>
                  <strong>{visitor.phone}</strong>
                </div>

                <div className="visitor-detail">
                  <span>Flat Number</span>
                  <strong>{visitor.flat || visitor.flat_number}</strong>
                </div>

                <div className="visitor-detail">
                  <span>Purpose</span>
                  <strong>{visitor.purpose}</strong>
                </div>

                <div className="visitor-detail">
                  <span>Vehicle</span>
                  <strong>
                    {visitor.vehicle || visitor.vehicle_number || "No vehicle"}
                  </strong>
                </div>
              </div>

              <div className="resident-approval">
                <div className="approval-header">
                  <span>Resident Approval</span>
                  <span
                    className={
                      isApproved ? "approval-approved" : "approval-pending"
                    }
                  >
                    {approvalStatus}
                  </span>
                </div>

                <div className="approval-details">
                  <span>Flat to Contact</span>
                  <strong>{visitor.flat || visitor.flat_number}</strong>
                </div>

                <div className="approval-details">
                  <span>Request Time</span>
                  <strong>
                    {visitor.createdAt || visitor.created_at
                      ? new Date(
                          visitor.createdAt || visitor.created_at
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </strong>
                </div>
              </div>

              {!isApproved && !isDenied && !isEntered && (
                <>
                  <div className="pending-approval">
                    <span>◷</span>
                    <div>
                      <strong>Approval Pending</strong>
                      <p>
                        Entry must not be allowed until the resident approves
                        the request.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="visitor-reset-button"
                    onClick={handleRefreshApproval}
                    style={{ width: "100%", marginTop: "14px" }}
                  >
                    Refresh Approval Status
                  </button>

                  <div className="visitor-decision-buttons">
                    <button
                      type="button"
                      className="deny-visitor-button"
                      onClick={() => handleDenyEntry(visitor)}
                    >
                      Deny Entry
                    </button>
                  </div>
                </>
              )}

              {isApproved && !isEntered && !isDenied && (
                <div className="visitor-decision-buttons">
                  <button
                    type="button"
                    className="allow-visitor-button"
                    onClick={() => handleAllowEntry(visitor)}
                  >
                    Allow Entry
                  </button>

                  <button
                    type="button"
                    className="deny-visitor-button"
                    onClick={() => handleDenyEntry(visitor)}
                  >
                    Deny Entry
                  </button>
                </div>
              )}

              {isEntered && (
                <div className="final-entry-status">
                  <span>✓</span>
                  <div>
                    <strong>Entry Successfully Recorded</strong>
                    <small>
                      {visitor.entry
                        ? new Date(visitor.entry).toLocaleString()
                        : "Entry saved"}
                    </small>
                  </div>
                </div>
              )}

              {isDenied && (
                <div className="final-denied-status">
                  <span>✕</span>
                  <div>
                    <strong>Entry Denied</strong>
                    <small>
                      The visitor has not been allowed inside.
                    </small>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SAVED VISITOR REQUESTS */}
        {/* SAVED VISITOR REQUESTS */}
<div
  id="pending-requests"
  className="saved-requests-card"
>
          <div className="visitor-card-header">
            <div>
              <h3>Saved Visitor Requests</h3>
              <p>{requests.length} request(s) saved </p>
            </div>
          </div>

          <button
            type="button"
            className="visitor-reset-button"
            onClick={loadRequests}
          >
            Refresh Requests
          </button>

          {requests.length === 0 ? (
            <p>No visitor requests found.</p>
          ) : (
            requests.map((request) => {
              const status = normalizeStatus(request.status);

              return (
                <div key={request.id} className="saved-request-item">
                  {/* Header puts the trash icon in the top-right corner */}
                  <div className="saved-request-top">
                    <strong>{request.name}</strong>

                    {status === "Denied" && (
                      <button
                        type="button"
                        className="delete-request-icon"
                        title="Delete denied request"
                        aria-label={`Delete request for ${request.name}`}
                        onClick={() => handleDeleteRequest(request)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  <p>Flat: {request.flat}</p>
                  <p>Purpose: {request.purpose}</p>
                  <p>
                    Status:{" "}
                    <span className={getRequestStatusClass(status)}>
                      {status}
                    </span>
                  </p>

                  <button
                    type="button"
                    className="visitor-verify-button"
                    onClick={() => {
                      setSelectedRequest(request);
                      setMessage("");
                    }}
                  >
                    View Request
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* SELECTED REQUEST DETAILS */}
        {selectedRequest && (
          <div className="selected-request-card">
            <div className="selected-request-header">
              <div>
                <span className="visitor-label">REQUEST INFORMATION</span>
                <h3>Selected Request Details</h3>
                <p>Complete details of the selected visitor request.</p>
              </div>

              <button
                type="button"
                className="visitor-reset-button"
                onClick={() => setSelectedRequest(null)}
              >
                Close ×
              </button>
            </div>

            <div className="selected-request-status-row">
              <span>Request Status</span>
              <strong className={getRequestStatusClass(selectedApproval)}>
                {selectedApproval}
              </strong>
            </div>

            <div className="selected-request-details-grid">
              <div className="selected-request-detail">
                <span>Visitor Name</span>
                <strong>
                  {selectedRequest.name || selectedRequest.visitor_name || "—"}
                </strong>
              </div>

              <div className="selected-request-detail">
                <span>Phone Number</span>
                <strong>{selectedRequest.phone || "—"}</strong>
              </div>

              <div className="selected-request-detail">
                <span>Flat Number</span>
                <strong>
                  {selectedRequest.flat || selectedRequest.flat_number || "—"}
                </strong>
              </div>

              <div className="selected-request-detail">
                <span>Purpose of Visit</span>
                <strong>{selectedRequest.purpose || "—"}</strong>
              </div>

              <div className="selected-request-detail">
                <span>Vehicle Number</span>
                <strong>
                  {selectedRequest.vehicle ||
                    selectedRequest.vehicle_number ||
                    "No vehicle"}
                </strong>
              </div>

              <div className="selected-request-detail">
                <span>Request Date &amp; Time</span>
                <strong>
                  {selectedRequest.createdAt || selectedRequest.created_at
                    ? new Date(
                        selectedRequest.createdAt ||
                          selectedRequest.created_at
                      ).toLocaleString()
                    : "—"}
                </strong>
              </div>
            </div>

            <p className="selected-request-note">
              Review the visitor's current status and take action below.
            </p>

            <div className="visitor-decision-buttons">
              {selectedApproval !== "Denied" &&
                selectedApproval !== "Entered" && (
                  <button
                    type="button"
                    className="deny-visitor-button"
                    onClick={() => handleDenyEntry(selectedRequest)}
                  >
                    Deny Entry
                  </button>
                )}

              {selectedApproval === "Approved" && (
                <button
                  type="button"
                  className="allow-visitor-button"
                  onClick={() => handleAllowEntry(selectedRequest)}
                >
                  Allow Entry
                </button>
              )}

              {/* No text delete button here; use the trash icon */}
              {selectedApproval === "Denied" && (
                <button
                  type="button"
                  className="delete-request-icon"
                  title="Delete denied request"
                  aria-label="Delete selected request"
                  onClick={() => handleDeleteRequest(selectedRequest)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="visitor-security-note">
        <div className="visitor-security-icon">🔒</div>
        <div>
          <strong>Security Reminder</strong>
          <p>
            Verify visitor details and confirm resident approval before
            allowing entry into the premises.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VisitorVerification;