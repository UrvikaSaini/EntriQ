import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./QRScanner.css";

function QRScanner() {
  const [qrCode, setQrCode] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [visitorStatus, setVisitorStatus] = useState("approved");

  const visitors = {
    QR001: {
      id: "QR001",
      name: "Rahul Sharma",
      flat: "A-204",
      purpose: "Guest Visit",
      phone: "98XXXXXX21",
      validUntil: "10:30 PM",
    },
    QR002: {
      id: "QR002",
      name: "Priya Mehta",
      flat: "B-102",
      purpose: "Personal Visit",
      phone: "97XXXXXX45",
      validUntil: "11:00 PM",
    },
    QR003: {
      id: "QR003",
      name: "Arjun Kapoor",
      flat: "C-305",
      purpose: "Family Visit",
      phone: "99XXXXXX78",
      validUntil: "09:30 PM",
    },
  };

  const handleVerify = () => {
    const code = qrCode.trim().toUpperCase();

    setError("");
    setActionMessage("");
    setVisitor(null);

    if (code === "") {
      setError("Please enter a QR code.");
      return;
    }

    if (visitors[code]) {
      setVisitor(visitors[code]);
      setVisitorStatus("approved");
    } else {
      setError("Invalid or unregistered QR code.");
    }
  };

  const handleDemoScan = () => {
    setQrCode("QR001");
    setError("");
    setActionMessage("");
    setVisitor(null);
  };

  const handleAllowEntry = () => {
    setVisitorStatus("inside");
    setActionMessage(
      `${visitor.name} has been granted entry successfully.`
    );
  };

  const handleMarkExit = () => {
    setVisitorStatus("exited");
    setActionMessage(
      `${visitor.name} has been marked as exited.`
    );
  };

  return (
    <section className="qr-page">

      <div className="qr-page-header">
        <div>
          <span className="qr-label">
            SECURITY VERIFICATION
          </span>

          <h2>QR Scanner</h2>

          <p>
            Scan or enter a visitor QR code to verify access.
          </p>
        </div>

        <div className="scanner-status">
          <span className="status-dot"></span>
          Scanner Ready
        </div>
      </div>

      <div className="scanner-layout">

        <div className="scanner-card">

          <div className="scanner-card-header">
            <div>
              <h3>Scan Visitor QR</h3>

              <p>
                Position the QR code inside the scanner area
              </p>
            </div>

            <div className="scanner-icon">
              ▣
            </div>
          </div>

          <div className="scanner-box">

            <div className="scanner-corners">
              <span className="corner top-left"></span>
              <span className="corner top-right"></span>
              <span className="corner bottom-left"></span>
              <span className="corner bottom-right"></span>
            </div>

            <div className="scan-line"></div>

            <div className="scanner-center-icon">
              ▣
            </div>

            <p>
              Place QR code inside the frame
            </p>

          </div>

          <div className="scanner-info">
            <span>●</span>
            Camera scanner ready
          </div>

        </div>

        <div className="verification-card">

          <div className="verification-header">
            <div>
              <h3>Manual Verification</h3>

              <p>
                Enter a visitor QR code manually
              </p>
            </div>
          </div>

          <label>
            QR Code ID
          </label>

          <div className="qr-input-wrapper">

            <span>#</span>

            <input
              type="text"
              placeholder="Enter QR Code (e.g. QR001)"
              value={qrCode}
              onChange={(e) => {
                setQrCode(e.target.value);
                setError("");
                setVisitor(null);
                setActionMessage("");
              }}
            />

          </div>

          <button
            className="verify-button"
            onClick={handleVerify}
          >
            <span>✓</span>
            Verify QR Code
          </button>

          <button
            className="demo-button"
            onClick={handleDemoScan}
          >
            Use Demo QR — QR001
          </button>

          {error && (
            <div className="qr-result error-result">

              <div className="result-icon">
                !
              </div>

              <div>
                <strong>
                  Verification Failed
                </strong>

                <p>
                  {error}
                </p>
              </div>

            </div>
          )}

          {visitor && (
            <div className="visitor-verification-result">

              <div className="verified-heading">

                <div className="result-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Visitor Verified
                  </strong>

                  <p>
                    Valid visitor pass detected.
                  </p>
                </div>

              </div>

              <div className="visitor-details">

                <div>
                  <span>Visitor</span>
                  <strong>{visitor.name}</strong>
                </div>

                <div>
                  <span>Flat</span>
                  <strong>{visitor.flat}</strong>
                </div>

                <div>
                  <span>Purpose</span>
                  <strong>{visitor.purpose}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{visitor.phone}</strong>
                </div>

                <div>
                  <span>Valid Until</span>
                  <strong>{visitor.validUntil}</strong>
                </div>

                <div>
                  <span>QR ID</span>
                  <strong>{visitor.id}</strong>
                </div>

              </div>

              <div className="visitor-status">

                {visitorStatus === "approved" && (
                  <>
                    <span className="status-dot"></span>
                    Approved — Waiting for Entry
                  </>
                )}

                {visitorStatus === "inside" && (
                  <>
                    <span className="status-dot"></span>
                    Visitor Currently Inside
                  </>
                )}

                {visitorStatus === "exited" && (
                  <>
                    <span className="status-dot"></span>
                    Visitor Exited
                  </>
                )}

              </div>

              {visitorStatus === "approved" && (
                <button
                  className="allow-entry-button"
                  onClick={handleAllowEntry}
                >
                  ✓ Allow Entry
                </button>
              )}

              {visitorStatus === "inside" && (
                <button
                  className="exit-button"
                  onClick={handleMarkExit}
                >
                  ↗ Mark Exit
                </button>
              )}

            </div>
          )}

          {actionMessage && (
            <div className="action-message">
              ✓ {actionMessage}
            </div>
          )}

        </div>

      </div>

      

      <div className="security-note">

        <span className="security-note-icon">
          🔒
        </span>

        <div>
          <strong>Secure Verification</strong>

          <p>
            Always verify the visitor details before allowing
            entry into the society.
          </p>
        </div>

      </div>

    </section>
  );
}

export default QRScanner;