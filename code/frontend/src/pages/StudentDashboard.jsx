import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, equipmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, Package, Clock, CheckCircle, ChevronRight,
  TrendingUp, LayoutGrid, AlertCircle
} from 'lucide-react';
import './StudentDashboard.css';

function StatCard({ icon, label, value, color, to }) {
  const inner = (
    <div className={`stat-card color-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
  return to ? <Link to={to} className="stat-card-link">{inner}</Link> : inner;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings]   = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      bookingAPI.getMy({}),
      equipmentAPI.getAll({ available: 'true' }),
    ]).then(([bRes, eRes]) => {
      setBookings(bRes.data.bookings);
      setEquipment(eRes.data.equipment.slice(0, 4));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending  = bookings.filter(b => b.status === 'pending').length;
  const approved = bookings.filter(b => b.status === 'approved').length;
  const total    = bookings.length;

  const recentBookings = [...bookings].slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-page">
      {/* Hero greeting */}
      <div className="dash-hero">
        <div>
          <h1>{greeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Welcome to the CV &amp; AI Lab Equipment Portal. Browse and book equipment for your research.</p>
        </div>
        <Link to="/catalog" className="btn btn-primary btn-lg">
          <LayoutGrid size={17} /> Browse Equipment
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <StatCard icon={<Clock size={20} />}        label="Pending Approval" value={pending}  color="warning" to="/my-bookings?status=pending" />
        <StatCard icon={<CheckCircle size={20} />}  label="Approved"         value={approved} color="success" to="/my-bookings?status=approved" />
        <StatCard icon={<Calendar size={20} />}     label="Total Bookings"   value={total}    color="primary" to="/my-bookings" />
        <StatCard icon={<Package size={20} />}      label="Items Available"  value={equipment.length + '+'} color="info" to="/catalog" />
      </div>

      <div className="dash-grid">
        {/* Recent bookings */}
        <div className="card">
          <div className="card-header dash-section-header">
            <div className="section-title-lg"><TrendingUp size={16} /> Recent Bookings</div>
            <Link to="/my-bookings" className="view-all">View all <ChevronRight size={13} /></Link>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {loading ? (
              <div className="mini-skeleton">{[...Array(3)].map((_, i) => <div key={i} className="mini-skel" />)}</div>
            ) : recentBookings.length === 0 ? (
              <div className="dash-empty">
                <Calendar size={32} />
                <p>No bookings yet. <Link to="/catalog">Book your first equipment →</Link></p>
              </div>
            ) : (
              <div className="recent-list">
                {recentBookings.map(b => (
                  <Link key={b.id} to={`/bookings/${b.id}`} className="recent-row">
                    <div className="recent-icon"><Package size={16} /></div>
                    <div className="recent-main">
                      <div className="recent-name">{b.equipment_name}</div>
                      <div className="recent-meta">
                        {b.booking_ref} · {new Date(b.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <span className={`badge badge-${b.status}`}>
                      <span className={`status-dot dot-${b.status}`} />
                      {b.status.replace('_', ' ')}
                    </span>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available equipment spotlight */}
        <div className="card">
          <div className="card-header dash-section-header">
            <div className="section-title-lg"><Package size={16} /> Available Now</div>
            <Link to="/catalog" className="view-all">Browse all <ChevronRight size={13} /></Link>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {loading ? (
              <div className="mini-skeleton">{[...Array(4)].map((_, i) => <div key={i} className="mini-skel" />)}</div>
            ) : equipment.length === 0 ? (
              <div className="dash-empty"><AlertCircle size={32} /><p>No equipment available right now.</p></div>
            ) : (
              <div className="avail-list">
                {equipment.map(eq => (
                  <Link key={eq.id} to={`/equipment/${eq.id}`} className="avail-row">
                    <div className="avail-icon"><Package size={16} /></div>
                    <div className="avail-main">
                      <div className="avail-name">{eq.name}</div>
                      <div className="avail-cat">{eq.category_name}</div>
                    </div>
                    <div className="avail-qty">{eq.available_quantity} left</div>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending approval alert */}
      {pending > 0 && (
        <div className="pending-alert">
          <Clock size={16} />
          <span>You have <strong>{pending}</strong> booking{pending > 1 ? 's' : ''} awaiting professor approval.</span>
          <Link to="/my-bookings" className="btn btn-sm btn-outline" style={{ marginLeft: 'auto' }}>
            View bookings
          </Link>
        </div>
      )}
    </div>
  );
}
