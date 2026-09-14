import React, { useState } from 'react'
import { FaShieldAlt, FaUserTie, FaUserCheck, FaQrcode, FaBell, FaChartLine, FaLock, FaArrowRight } from 'react-icons/fa'
import './LandingPage.css'

function LandingPage() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectRole, setSelectRole] = useState("Resident");
    const [isSignUp, setIsSignUp] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phoneNo: '',
        unit: ''
    })

    const handleRoleSelect = (role) => {
        setSelectRole(role);
        setShowAuthModal(true);
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onLoginSuccess) {
            onLoginSuccess({
                role: selectRole,
                email: formData.email,
                id: 1
            });
        }
    };
    return (
        <>
        <div className="landing-page">
            <header className="landing-nav">
                <div className="brand-logo">
                    <FaShieldAlt className="logo-icon" />
                    <span className="brand-name">EntriQ</span>
                </div>
                <div className="nav-actions">
                    <button className="signin-btn" onClick={() => handleRoleSelect('resident')}>Sign In</button>
                    <button className="register-btn" onClick={() => { setIsSignUp(true); handleRoleSelect('resident'); }}>Register</button>
                </div>
            </header>

            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">Smart Gate Management System</span>
                    <h1>Seamless and Secure Community Access Control</h1>
                    <p>EntriQ simplifies visitor registration, gate approvals, digital pass generation,
                        and resident security management in real time.</p>
                    <div className="hero-cta">
                        <button className="btn-hero-primary" onClick={() => handleRoleSelect('resident')}>
                            Resident Access <FaArrowRight />
                        </button>
                        <button className="btn-hero-secondary" onClick={() => handleRoleSelect('guard')}>
                            Guard Desk
                        </button>
                    </div>
                </div>
            </section>

            <section className="roles-section">
                <h2>Choose Your Portal</h2>
                <p className="section-subtitle">Select your role to log in or register into the platform</p>

                <div className="roles-grid">
                    <div className="role-card" onClick={() => handleRoleSelect('admin')}>
                        <div className="role-icon admin">
                            <FaUserTie />
                        </div>
                        <h3>Administrator</h3>
                        <p>Manage society settings, audit gate logs, view analytics, and control resident databases.</p>

                    </div>

                    <div className="role-card" onClick={() => handleRoleSelect('resident')}>
                        <div className="role-icon resident">
                            <FaUserCheck />
                        </div>
                        <h3>Resident</h3>
                        <p>Approve/reject incoming visitors, pre-invite guests, generate QR passes, and update your profile.</p>

                    </div>

                    <div className="role-card" onClick={() => handleRoleSelect('guard')}>
                        <div className="role-icon guard">
                            <FaShieldAlt />
                        </div>
                        <h3>Gate Guard</h3>
                        <p>Verify visitor credentials, scan entry passes, log vehicle entries, and send approval requests.</p>

                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>Platform Key Features</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <FaQrcode className="feature-icon" />
                        <h4>Digital QR Passes</h4>
                        <p>Pre-invite visitors with temporary QR code passes for fast-track entry validation.</p>
                    </div>

                    <div className="feature-item">
                        <FaBell className="feature-icon" />
                        <h4>Real-time Notifications</h4>
                        <p>Get instant notifications on your phone or web dashboard when visitors arrive at the main gate.</p>
                    </div>

                    <div className="feature-item">
                        <FaShieldAlt className="feature-icon" />
                        <h4>Visitor Request Logs</h4>
                        <p>Track visitor history, vehicle numbers, entry/exit timestamps, and approval statuses.</p>
                    </div>

                    <div className="feature-item">
                        <FaChartLine className="feature-icon" />
                        <h4>Admin Dashboard Analytics</h4>
                        <p>Comprehensive reports and real-time occupancy metrics for total community security.</p>
                    </div>
                </div>
            </section>

            {showAuthModal && (
                <div className="modal-overlay">
                    <div className="auth-modal">
                        <button className="modal-close" onClick={() => setShowAuthModal(false)}>
                            &times;
                        </button>

                        <div className="modal-header">
                            <h3>{isSignUp ? 'Create Account' : 'Welcome Back'}</h3>
                            <p>Logging in as <span className="highlight-role">{selectRole.toUpperCase()}</span></p>
                        </div>

                        <div className="auth-tabs">
                            <button
                                className={selectRole === 'resident' ? 'active' : ''} onClick={() => setSelectRole('resident')}>
                                Resident
                            </button>
                            <button
                                className={selectRole === 'guard' ? 'active' : ''} onClick={() => setSelectRole('guard')}>
                                Guard
                            </button>
                            <button
                                className={selectRole === 'admin' ? 'active' : ''} onClick={() => setSelectRole('admin')}>
                                Admin
                            </button>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {isSignUp && selectRole === 'resident' && (
                                <>
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <input type="text" name="resName" placeholder="e.g. Shanaya Kapoor" value={formData.resName} onChange={handleInputChange} required/>
                                    </div>
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>Phone Number</label>
                                            <input type="text" name="phoneNo" placeholder="9876543210" value={formData.phoneNo} onChange={handleInputChange} required/>
                                        </div>
                                        <div className="input-group">
                                            <label>Unit / Flat No.</label>
                                            <input type="text" name="unit" placeholder="A-101" value={formData.unit} onChange={handleInputChange} require/>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="input-group">
                                <label>Email / Username</label>
                                <input type="email" name="email" placeholder="name@entriq.com" value={formData.email} onChange={handleInputChange} required/>
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required/>
                            </div>

                            <button type="submit" className="btn-submit-auth">
                                {isSignUp ? 'Register Account' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-toggle">
                            {isSignUp ? (
                                <p>Already have an account? <span onClick={() => setIsSignUp(false)}>Sign In</span></p>
                            ) : (
                                <p>Need an account? <span onClick={() => setIsSignUp(true)}>Register</span></p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>    
        </>
    )
}
export default LandingPage