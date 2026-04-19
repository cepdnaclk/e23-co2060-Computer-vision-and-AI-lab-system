import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircle, XCircle, Clock, Package, LogOut,
  Users, ChevronDown, Search, FlaskConical
} from 'lucide-react';
import './ProfessorDashboard.css';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}><span className={`status-dot dot-${status}`} />{status.replace('_', ' ')}</span>;
}

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null); // booking object
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(null);
  const [search, setSearch] = useState('');

  const fetchBookings = async (status) => {
    setLoading(true);
    try {
      const res = await bookingAPI.getAll({ status: status || undefined, limit: 50 });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(activeTab); }, [activeTab]);

  const handleApprove = async (bookingId) => {
    setProcessing(bookingId);
    try {
      await bookingAPI.approve(bookingId);
      toast.success('Booking approved! QR code generated.');
      fetchBookings(activeTab);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Please provide a reason'); return; }
    setProcessing(rejectModal.id);
    try {
      await bookingAPI.reject(rejectModal.id, rejectReason);
      toast.success('Booking rejected.');
      setRejectModal(null); setRejectReason('');
      fetchBookings(activeTab);
    } catch (err) {
      toast.error('Failed to reject booking');
    } finally {
      setProcessing(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = bookings.filter(b =>
    !search ||
    b.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.equipment_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.booking_ref?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="prof-dashboard">
      {/* Sidebar */}
      <aside className="prof-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><FlaskConical size={20} /></div>
          <div>
            <div className="logo-title">CV &amp; AI Lab</div>
            <div className="logo-sub">Management Portal</div>
          </div>
        </div>

        <div className="sidebar-section-label">Bookings</div>
        <nav className="sidebar-nav">
          {[
            { value: 'pending',   label: 'Pending Review', count: pendingCount },
            { value: 'approved',  label: 'Approved' },
            { value: 'picked_up', label: 'Picked Up' },
            { value: 'returned',  label: 'Returned' },
            { value: 'rejected',  label: 'Rejected' },
            { value: '',          label: 'All Bookings' },
          ].map(tab => (
            <button
              key={tab.value}
              className={`nav-item ${activeTab === tab.value ? 'nav-active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              <span style={{ flex: 1, textAlign: 'left' }}>{tab.label}</span>
              {tab.count > 0 && <span className="nav-count">{tab.count}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0)}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}><LogOut size={15} /></button>
        </div>
      </aside>

      {/* Main */}
      <div className="prof-main">
        <div className="prof-topbar">
          <div>
            <h1 className="prof-title">
              {activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Bookings' : 'All Bookings'}
            </h1>
            <p className="prof-subtitle">
              {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
              {activeTab === 'pending' && pendingCount > 0 ? ` — ${pendingCount} require your attention` : ''}
            </p>
          </div>
          <div className="prof-search">
            <Search size={15} className="search-icon" />
            <input type="text" placeholder="Search name, equipment, ref..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="search-input" />
          </div>
        </div>

        {loading ? (
          <div className="prof-skeleton">
            {[...Array(5)].map((_, i) => <div key={i} className="skel-row" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Clock size={40} />
            <h3>No {activeTab || ''} bookings</h3>
            <p>Nothing to show here right now.</p>
          </div>
        ) : (
          <div className="booking-table">
            <div className="table-header">
              <span>Ref</span>
              <span>Student</span>
              <span>Equipment</span>
              <span>Dates</span>
              <span>Status</span>
              {activeTab === 'pending' && <span>Actions</span>}
            </div>

            {filtered.map(b => (
              <div key={b.id} className="table-row">
                <span className="ref-col">{b.booking_ref}</span>
                <div className="student-col">
                  <div className="student-name">{b.student_name}</div>
                  <div className="student-id">{b.student_id || b.user_role}</div>
                </div>
                <div className="eq-col">
                  <div className="eq-name">{b.equipment_name}</div>
                  <div className="eq-qty">{b.quantity} unit(s)</div>
                </div>
                <div className="date-col">
                  <div>{new Date(b.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                  <div className="date-to">→ {new Date(b.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <span><StatusBadge status={b.status} /></span>
                {activeTab === 'pending' && (
                  <div className="action-col">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApprove(b.id)}
                      disabled={processing === b.id}
                    >
                      {processing === b.id ? <span className="btn-spinner sm" /> : <><CheckCircle size={13} /> Approve</>}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => { setRejectModal(b); setRejectReason(''); }}
                      disabled={processing === b.id}
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Reject Booking</h3>
            <p className="modal-sub">
              Rejecting <strong>{rejectModal.booking_ref}</strong> for <strong>{rejectModal.student_name}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">Reason for rejection *</label>
              <textarea className="form-textarea" rows={4}
                placeholder="Explain why this booking is being rejected..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setRejectModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReject} disabled={processing}>
                {processing ? <span className="btn-spinner" /> : <><XCircle size={14} /> Confirm Rejection</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}