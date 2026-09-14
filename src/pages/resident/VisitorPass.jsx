import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { FaTicketAlt, FaPlus, FaQrcode, FaShareAlt, FaCopy, FaCheck, FaBan, FaExclamationCircle, FaTimes ,FaShieldAlt} from 'react-icons/fa';
import './VisitorPass.css';

export default function VisitorPass({ residentId = 1, residentid }) {
    const activeResidentId = residentid || residentId || 1;
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [copiedCode, setCopiedCode] = useState('');
    const [showModal, setShowModal] = useState(false);

    const getDefaultUntilDate = () => {
        const tomorrow = new Date();
        tomorrow.setHours(tomorrow.getHours() + 24);
        return tomorrow.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        visitorName: '',
        visitorPhone: '',
        visitorType: 'Guest',
        validFrom: new Date().toISOString().slice(0, 16),
        validUntil: getDefaultUntilDate()
    });

    const fetchPasses = async () => {
        try {
            setLoading(true);
            setErrorMsg('');
            const response = await axios.get(`http://localhost:5000/api/visitor_passes/${activeResidentId}`);
            setPasses(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error in Fetching Passes:', error);
            setErrorMsg('Failed to Load Visitor Passes. Please ensure the Backend Server is running on Port 5000.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (activeResidentId) {
            fetchPasses();
        }
    }, [activeResidentId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreatePass = async (e) => {
        if (e) e.preventDefault();
        if (!formData.visitorName.trim()) {
            setErrorMsg('Please Enter the Visitor Name.');
            return;
        }
        if (!formData.visitorPhone.trim()) {
            setErrorMsg('Please Enter the Visitor Phone Number.');
            return;
        }
        try {
            setSubmitting(true);
            setErrorMsg('');
            const payload = {
                residentId: activeResidentId,
                residentid: activeResidentId,
                visitorName: formData.visitorName,
                visitorPhone: formData.visitorPhone,
                visitorType: formData.visitorType,
                validFrom: formData.validFrom,
                validUntil: formData.validUntil || getDefaultUntilDate()
            };
            const res = await axios.post('http://localhost:5000/api/visitor_passes', payload);
            const generatedCode = res.data.passcode || res.data.passCode || 'PASS-00';
            setSuccessMsg(`QR Pass Generated Successfully! Passcode: ${generatedCode}`);
            setShowModal(false);
            setFormData({
                visitorName: '',
                visitorPhone: '',
                visitorType: 'Guest',
                validFrom: new Date().toISOString().slice(0, 16),
                validUntil: getDefaultUntilDate()
            });
            fetchPasses();
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            console.error('Error in Creating Pass:', error);
            setErrorMsg(error.response?.data?.error || 'Failed to Generate Entry Pass. Check Database Connection.');
        } finally {
            setSubmitting(false);
        }
    };
    const handleRevokePass = async (passId) => {
        try {
            await axios.put(`http://localhost:5000/api/visitor_passes/revoke/${passId}`);
            setSuccessMsg('Pass Cancelled Successfully.');
            fetchPasses();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error('Error in Cancelling Pass:', error);
            setErrorMsg('Failed to Cancel Pass.');
        }
    };
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 2000);
    };
    const handleSharePass = (pass) => {
        const code = pass.passcode || pass.passCode;
        const name = pass.visitorname || pass.visitorName;
        const shareText = `Hello ${name}, Here is your Gate Entry Pass for EntriQ.\nPasscode: ${code} \nPlease Show this at the Gate on Arrival.`;
        if (navigator.share) {
            navigator.share({
                title: 'EntriQ Gate Pass',
                text: shareText
            }).catch((err) => console.log('Share canceled', err));
        } else {
            navigator.clipboard.writeText(shareText);
            setSuccessMsg(`Pass Details Copied for ${name}!`);
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };
    return (
        <div className="pass-page">
            <nav className="pass-nav">
                <div className="brand-logo">
                    <FaShieldAlt className="logo-icon" />
                    <span>EntriQ</span>
                </div>
                <h2>Visitor Pass</h2>
            </nav>
            <header className="pass-header">
                <div className="pass-head-lines">
                    <p className="pass-subtitle">Generate digital QR codes and Passcodes for Direct Gate Verification.</p>
                </div>
                <button className="create-pass-btn" onClick={() => { setErrorMsg(''); setShowModal(true); }}>
                    <FaPlus /> Create Pass
                </button>
            </header>

            {errorMsg && (
                <div className="alert-banner error-alert">
                    <FaExclamationCircle /> {errorMsg}
                </div>
            )}
            {successMsg && (
                <div className="alert-banner success-alert">
                    <FaCheck /> {successMsg}
                </div>
            )}
            {loading ? (
                <div className="pass-loading">Loading Visitor Passes...</div>
            ) : passes.length === 0 ? (
                <div className="pass-empty">
                    <FaTicketAlt className="empty-icon" />
                    <p>No Active or Past Visitor Passes Generated yet.</p>
                </div>
            ) : (
                <div className="passes-grid">
                    {passes.map((p) => {
                        const passId = p.passid || p.id;
                        const passCode = p.passcode || p.passCode || 'PASS-00';
                        const visitorName = p.visitorname || p.visName || 'Guest';
                        const visitorPhone = p.phoneno || p.visPhone || 'N/A';
                        const visitorType = p.purpose || p.type || 'Guest';
                        const status = (p.status || 'Active').toLowerCase();
                        const validUntil = p.validuntil || p.validUpto;
                        return (
                            <div key={passId} className={`pass-card ${status === 'revoked' ? 'pass-revoked' : ''}`}>
                                <div className="pass-header">
                                    <span className="pass-badge">
                                        <FaTicketAlt /> {visitorType.toUpperCase()}
                                    </span>
                                    <span className={`status-${status}`}>
                                        {p.status || 'Active'}
                                    </span>
                                </div>

                                <div className="qr-container">
                                    <QRCodeSVG
                                        value={JSON.stringify({ passId, passCode, visitor: visitorName })}
                                        size={130}
                                        level="H"
                                    />
                                    <div className="code-box">
                                        <span className="pass-code-label">PASSCODE : </span>
                                        <strong className="pass-code">{passCode}</strong>
                                    </div>
                                </div>
                                <div className="pass-details">
                                    <h4>{visitorName}</h4>
                                    <p>📞 {visitorPhone}</p>
                                    {validUntil && (
                                        <small>Valid Until: {new Date(validUntil).toLocaleString()}</small>
                                    )}
                                </div>
                                <div className="pass-actions">
                                    <button className="copy-btn" onClick={() => handleCopyCode(passCode)}>
                                        {copiedCode === passCode ? <><FaCheck style={{ color: '#2e7d32' }} /> Copied</> : <><FaCopy /> Copy Code</>}
                                    </button>
                                    <button className="share-btn" onClick={() => handleSharePass(p)}>
                                        <FaShareAlt /> Share
                                    </button>
                                </div>
                                {status === 'active' && (
                                    <button className="cancel-pass-btn" onClick={() => handleRevokePass(passId)}>
                                        <FaBan /> Cancel Pass
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div >
            )}
            {showModal && (
                <div className="create-pass-form">
                    <div className="form-card">
                        <div className="form-header">
                            <h3>Generate QR Pass</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePass}>
                            <div className="form-field">
                                <label>Visitor Name </label>
                                <input type="text" name="visitorName" placeholder="e.g. Kayra Mehra" required value={formData.visitorName} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label>Visitor Phone </label>
                                <input type="tel" name="visitorPhone" placeholder="e.g. 9876543210" required value={formData.visitorPhone} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label>Category / Purpose</label>
                                <select name="visitorType" value={formData.visitorType} onChange={handleChange}>
                                    <option value="Guest">Guest</option>
                                    <option value="Delivery">Delivery</option>
                                    <option value="Cab">Cab</option>
                                    <option value="Service">Service Provider</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Valid From</label>
                                <input type="datetime-local" name="validFrom" value={formData.validFrom} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label>Valid Until *</label>
                                <input type="datetime-local" name="validUntil" required value={formData.validUntil} onChange={handleChange} />
                            </div>
                            <div className="form-btns">
                                <button type="submit" className="submit-btn" onClick={handleCreatePass} disabled={submitting}>
                                    <FaQrcode /> {submitting ? 'Generating...' : 'Generate QR Pass'}
                                </button>
                                <button type="button" className="cancelpass-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
}