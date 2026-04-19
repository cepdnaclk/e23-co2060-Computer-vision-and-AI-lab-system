import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { Calendar, ChevronRight, Package, Filter, Clock } from 'lucide-react';
import './MyBookings.css';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'returned', label: 'Returned' },
  { value: 'cancelled', label: 'Cancelled' },
];

function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className={`status-dot dot-${status}`} />
      {status.replace('_', ' ')}
    </span>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const fetchBookings = async (status) => {
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const res = await bookingAPI.getMy(params);
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(activeTab); }, [activeTab]);

  const pendingCount   = bookings.filter(b => b.status === 'pending').length;
  const approvedCount  = bookings.filter(b => b.status === 'approved').length;

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Track and manage your equipment booking requests</p>
      </div>

      {/* Stats row */}
      {!loading && bookings.length > 0 && (
        <div className="booking-stats">
          <div className="stat-chip"><Clock size={14} />{pendingCount} pending</div>
          <div className="stat-chip approved"><Calendar size={14} />{approvedCount} approved</div>
          <div className="stat-chip total"><Package size={14} />{bookings.length} total</div>
        </div>
      )}

      {/* Status tabs */}
      <div className="status-tabs">
        <Filter size={14} className="filter-icon" />
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            className={`status-tab ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="bookings-skeleton">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton-row" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>No bookings yet</h3>
          <p>{activeTab ? `No ${activeTab} bookings found` : 'You haven\'t made any bookings yet'}</p>
          <Link to="/catalog" className="btn btn-primary btn-sm">Browse Equipment</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((b, idx) => (
            <Link
              key={b.id}
              to={`/bookings/${b.id}`}
              className="booking-row fade-up"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="booking-row-icon">
                <Package size={20} />
              </div>
              <div className="booking-row-main">
                <div className="booking-row-top">
                  <span className="booking-eq-name">{b.equipment_name}</span>
                  <StatusBadge status={b.status} />
                </div>
                <div className="booking-row-meta">
                  <span>{b.booking_ref}</span>
                  <span>•</span>
                  <span>{b.quantity} unit{b.quantity !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>
                    {new Date(b.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {' → '}
                    {new Date(b.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="booking-row-right">
                {b.total_fee > 0
                  ? <span className="booking-fee">Rs. {parseFloat(b.total_fee).toFixed(2)}</span>
                  : <span className="booking-free">Free</span>
                }
                <ChevronRight size={16} className="row-arrow" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}