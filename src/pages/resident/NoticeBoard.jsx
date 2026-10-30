import React, { useState, useEffect } from 'react';
import {
    Pin, Bell, AlertTriangle, Wrench, Calendar, Info,
    Search, Clock, ChevronRight, X, Paperclip
} from 'lucide-react';
import './NoticeBoard.css';

export default function NoticeBoard() {
    const [notices, setNotices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeNoticeModal, setActiveNoticeModal] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/notices')
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setNotices(response.data);
                }
            })
            .catch(err => console.error('Failed to fetch notices:', err));
    }, []);

    const markAsRead = (id) => {
        setNotices(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
    };

    const getCategoryBadge = (category) => {
        switch (category) {
            case 'Urgent':
                return <span className="badge badge-urgent"><AlertTriangle className="badge-icon" /> Urgent</span>;
            case 'Maintenance':
                return <span className="badge badge-maintenance"><Wrench className="badge-icon" /> Maintenance</span>;
            case 'Event':
                return <span className="badge badge-event"><Calendar className="badge-icon" /> Event</span>;
            default:
                return <span className="badge badge-general"><Info className="badge-icon" /> General</span>;
        }
    };

    const filteredNotices = notices.filter(n => {
        const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const unreadCount = notices.filter(n => !n.is_read).length;

    return (
        <div className="notice-board-container">

            {/* Header Bar */}
            <div className="notice-header">
                <div>
                    <div className="title-row">
                        <h1 className="notice-title">Digital Notice Board</h1>
                        {unreadCount > 0 && (
                            <span className="unread-pill">{unreadCount} Unread</span>
                        )}
                    </div>
                    <p className="notice-subtitle">Official society announcements, broadcasts, and event updates</p>
                </div>

                {/* Search */}
                <div className="search-box">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="category-tabs">
                {['All', 'Urgent', 'Maintenance', 'Event', 'General'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`tab-btn ${selectedCategory === cat ? 'tab-btn-active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid List */}
            <div className="notice-grid">
                {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                        <div
                            key={notice.id}
                            onClick={() => {
                                setActiveNoticeModal(notice);
                                markAsRead(notice.id);
                            }}
                            className={`notice-card ${notice.is_pinned ? 'notice-card-pinned' : ''}`}
                        >
                            {!notice.is_read && <span className="unread-dot" />}

                            <div>
                                <div className="card-top-meta">
                                    {notice.is_pinned && (
                                        <span className="pinned-badge">
                                            <Pin className="pin-icon" /> Pinned
                                        </span>
                                    )}
                                    {getCategoryBadge(notice.category)}
                                </div>

                                <h3 className="card-title">{notice.title}</h3>
                                <p className="card-excerpt">{notice.content}</p>
                            </div>

                            <div className="card-footer">
                                <div className="footer-time">
                                    <Clock className="clock-icon" />
                                    <span>{new Date(notice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>

                                <div className="read-more-link">
                                    <span>Read full</span>
                                    <ChevronRight className="arrow-icon" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <Bell className="empty-icon" />
                        <p>No announcements found</p>
                    </div>
                )}
            </div>

            {/* Modal Popup */}
            {activeNoticeModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <button onClick={() => setActiveNoticeModal(null)} className="modal-close-btn">
                            <X className="close-icon" />
                        </button>

                        <div className="modal-badge-row">
                            {getCategoryBadge(activeNoticeModal.category)}
                            {activeNoticeModal.is_pinned && (
                                <span className="pinned-badge">
                                    <Pin className="pin-icon" /> Pinned
                                </span>
                            )}
                        </div>

                        <h2 className="modal-title">{activeNoticeModal.title}</h2>

                        <div className="modal-submeta">
                            <span>By: <strong>{activeNoticeModal.author_name}</strong></span>
                            <span>•</span>
                            <span>{new Date(activeNoticeModal.created_at).toLocaleString()}</span>
                        </div>

                        <p className="modal-content">{activeNoticeModal.content}</p>

                        {activeNoticeModal.attachment_url && (
                            <div className="attachment-box">
                                <div className="attachment-info">
                                    <Paperclip className="attachment-icon" />
                                    <span>{activeNoticeModal.attachment_url}</span>
                                </div>
                                <button className="download-btn">Download</button>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={() => setActiveNoticeModal(null)} className="close-action-btn">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}