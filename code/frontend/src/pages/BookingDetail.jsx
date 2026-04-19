import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Calendar, Package, Clock, CheckCircle, XCircle,
  QrCode, Info, AlertTriangle, MapPin, User, FileText
} from 'lucide-react';
import './BookingDetail.css';

function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`} style={{ fontSize: 14, padding: '6px 16px' }}>
      <span className={`status-dot dot-${status}`} />
      {status.replace('_', ' ')}
    </span>
  );
}

const STEP_STATUS = {
  pending:   1,
  approved:  2,
  picked_up: 3,
  returned:  4,
  rejected:  -1,
  cancelled: -1,
};

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    bookingAPI.getById(id)
      .then(res => { setBooking(res.data.booking); setHistory(res.data.history); })
      .catch(() => navigate('/my-bookings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled.');
      setBooking({ ...booking, status: 'cancelled' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!booking) return null;

  const days = Math.max(1, Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)) + 1);
  const currentStep = STEP_STATUS[booking.status] || 0;
  const canCancel = ['pending', 'approved'].includes(booking.status) && user?.id === booking.user_id;

  return (
    <div className="booking-detail-page fade-up">
      <div className="detail-nav">
        <button className="back-btn" onClick={() => navigate('/my-bookings')}>
          <ArrowLeft size={16} /> My Bookings
        </button>
        <div className="detail-ref">{booking.booking_ref}</div>
      </div>

      {/* Header */}
      <div className="detail-header-card card">
        <div className="card-body">
          <div className="dh-top">
            <div>
              <div className="dh-eq-name">{booking.equipment_name}</div>
              <div className="dh-eq-model">{booking.equipment_model}</div>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* Progress tracker */}
          {!['rejected', 'cancelled'].includes(booking.status) && (
            <div className="progress-tracker">
              {['Submitted', 'Approved', 'Picked Up', 'Returned'].map((label, i) => (
                <React.Fragment key={i}>
                  <div className={`tracker-step ${currentStep > i ? 'done' : currentStep === i + 1 ? 'current' : ''}`}>
                    <div className="tracker-dot">
                      {currentStep > i ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
                    </div>
                    <span>{label}</span>
                  </div>
                  {i < 3 && <div className={`tracker-line ${currentStep > i + 1 ? 'done' : ''}`} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {booking.status === 'rejected' && (
            <div className="rejection-notice">
              <XCircle size={16} />
              <div>
                <strong>Booking Rejected</strong>
                <p>{booking.rejection_reason || 'No reason provided'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-left-col">
          {/* Booking info */}
          <div className="card">
            <div className="card-body">
              <div className="section-title"><FileText size={14} /> Booking Information</div>
              <div className="info-table">
                <div className="info-tr">
                  <span><Calendar size={13} /> Date Range</span>
                  <strong>
                    {new Date(booking.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' → '}
                    {new Date(booking.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </strong>
                </div>
                <div className="info-tr">
                  <span><Clock size={13} /> Duration</span>
                  <strong>{days} day{days !== 1 ? 's' : ''}</strong>
                </div>
                <div className="info-tr">
                  <span><Package size={13} /> Quantity</span>
                  <strong>{booking.quantity} unit{booking.quantity !== 1 ? 's' : ''}</strong>
                </div>
                <div className="info-tr">
                  <span><MapPin size={13} /> Location</span>
                  <strong>{booking.location || 'See equipment details'}</strong>
                </div>
                {booking.approved_by_name && (
                  <div className="info-tr">
                    <span><User size={13} /> Approved By</span>
                    <strong>{booking.approved_by_name}</strong>
                  </div>
                )}
                {booking.total_fee > 0 && (
                  <div className="info-tr fee-tr">
                    <span>Total Fee</span>
                    <strong>Rs. {parseFloat(booking.total_fee).toFixed(2)}</strong>
                  </div>
                )}
                <div className="info-tr">
                  <span>Payment</span>
                  <strong className={`payment-${booking.payment_status}`}>{booking.payment_status.replace('_', ' ')}</strong>
                </div>
                <div className="info-tr">
                  <span>Submitted</span>
                  <strong>{new Date(booking.created_at).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="card">
            <div className="card-body">
              <div className="section-title"><Info size={14} /> Purpose</div>
              <p className="purpose-text">{booking.purpose}</p>
              {booking.notes && (
                <>
                  <div className="section-title" style={{ marginTop: 16 }}>Notes</div>
                  <p className="purpose-text">{booking.notes}</p>
                </>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <div className="card-body">
                <div className="section-title"><Clock size={14} /> Status History</div>
                <div className="history-list">
                  {history.map((h, i) => (
                    <div key={h.id} className={`history-item ${i === history.length - 1 ? 'last' : ''}`}>
                      <div className="history-dot" />
                      <div className="history-content">
                        <div className="history-status">
                          {h.old_status && <><span className={`badge badge-${h.old_status} xs`}>{h.old_status}</span> → </>}
                          <span className={`badge badge-${h.new_status} xs`}>{h.new_status}</span>
                        </div>
                        {h.note && <div className="history-note">{h.note}</div>}
                        <div className="history-time">
                          {h.changed_by_name && <span>by {h.changed_by_name} · </span>}
                          {new Date(h.changed_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right col: QR code */}
        <div className="detail-right-col">
          {booking.status === 'approved' && booking.qr_code ? (
            <div className="card qr-card">
              <div className="card-body">
                <div className="section-title"><QrCode size={14} /> Your QR Code</div>
                <div className="qr-wrapper">
                  <img src={booking.qr_code} alt="QR Code" className="qr-image" />
                </div>
                <p className="qr-instruction">
                  Show this QR code to the lab officer when picking up the equipment.
                </p>
                <button
                  className="btn btn-outline btn-block btn-sm"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = booking.qr_code;
                    a.download = `${booking.booking_ref}-qr.png`;
                    a.click();
                  }}
                >
                  <QrCode size={14} /> Download QR
                </button>
              </div>
            </div>
          ) : booking.status === 'pending' ? (
            <div className="card pending-info-card">
              <div className="card-body">
                <div className="pending-icon"><Clock size={32} /></div>
                <h3>Awaiting Approval</h3>
                <p>Your booking is in the review queue. A professor will approve or reject it shortly. You'll receive a notification.</p>
              </div>
            </div>
          ) : null}

          {/* Cancel button */}
          {canCancel && (
            <button className="btn btn-danger btn-block" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? <span className="btn-spinner" /> : <><XCircle size={15} /> Cancel Booking</>}
            </button>
          )}

          <Link to="/catalog" className="btn btn-ghost btn-block">
            <Package size={15} /> Browse More Equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
