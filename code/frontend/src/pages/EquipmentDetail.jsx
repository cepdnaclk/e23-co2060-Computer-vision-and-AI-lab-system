import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { equipmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, MapPin, Package, CheckCircle, XCircle,
  Calendar, Camera, Cpu, Wind, Activity, Info
} from 'lucide-react';
import './EquipmentDetail.css';

const ICON_MAP = { camera: Camera, cpu: Cpu, drone: Wind, activity: Activity };

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkDates, setCheckDates] = useState({ start: '', end: '' });
  const [availability, setAvailability] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);

  useEffect(() => {
    equipmentAPI.getById(id)
      .then(res => setEquipment(res.data.equipment))
      .catch(() => navigate('/catalog'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const checkAvailability = async () => {
    if (!checkDates.start || !checkDates.end) return;
    setCheckingAvail(true);
    try {
      const res = await equipmentAPI.checkAvailability(id, checkDates.start, checkDates.end);
      setAvailability(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAvail(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!equipment) return null;

  const IconComp = ICON_MAP[equipment.category_icon] || Package;
  const canBook = ['student', 'external'].includes(user?.role);

  return (
    <div className="detail-page fade-up">
      <button className="back-btn" onClick={() => navigate('/catalog')}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="detail-layout">
        {/* Left: Image + quick info */}
        <div className="detail-left">
          <div className="detail-image">
            {equipment.image_url ? (
              <img src={equipment.image_url} alt={equipment.name} />
            ) : (
              <div className="detail-placeholder"><IconComp size={64} /></div>
            )}
          </div>

          <div className="card">
            <div className="card-body">
              <div className="detail-info-title">Quick Info</div>
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Category</span>
                  <span className="info-value">{equipment.category_name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Units</span>
                  <span className="info-value">{equipment.total_quantity}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Available</span>
                  <span className={`info-value ${equipment.available_quantity > 0 ? 'text-success' : 'text-error'}`}>
                    {equipment.available_quantity} unit(s)
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Condition</span>
                  <span className="info-value">{equipment.condition}</span>
                </div>
                <div className="info-row">
                  <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                  <span className="info-value">{equipment.location}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Cost</span>
                  <span className="info-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    {equipment.requires_payment ? `Rs. ${equipment.daily_rate}/day` : 'Free for students'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details + booking */}
        <div className="detail-right">
          <div className="detail-header">
            <div className="eq-category"><IconComp size={13} />{equipment.category_name}</div>
            <h1>{equipment.name}</h1>
            <p className="detail-model">{equipment.model}</p>
          </div>

          <div className="card detail-desc-card">
            <div className="card-body">
              <div className="detail-info-title"><Info size={14} /> Description</div>
              <p>{equipment.description || 'No description available.'}</p>
            </div>
          </div>

          {/* Availability checker */}
          <div className="card avail-card">
            <div className="card-body">
              <div className="detail-info-title"><Calendar size={14} /> Check Availability</div>
              <div className="avail-date-row">
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">From</label>
                  <input type="date" className="form-input" min={today}
                    value={checkDates.start}
                    onChange={e => { setCheckDates({ ...checkDates, start: e.target.value }); setAvailability(null); }} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">To</label>
                  <input type="date" className="form-input" min={checkDates.start || today}
                    value={checkDates.end}
                    onChange={e => { setCheckDates({ ...checkDates, end: e.target.value }); setAvailability(null); }} />
                </div>
                <button className="btn btn-outline" onClick={checkAvailability}
                  disabled={!checkDates.start || !checkDates.end || checkingAvail}
                  style={{ alignSelf: 'flex-end' }}>
                  {checkingAvail ? <span className="btn-spinner" style={{ borderColor: 'var(--primary)', borderTopColor: 'var(--primary-light)' }} /> : 'Check'}
                </button>
              </div>

              {availability && (
                <div className={`avail-result ${availability.is_available ? 'avail-yes' : 'avail-no'}`}>
                  {availability.is_available
                    ? <><CheckCircle size={16} /> <strong>{availability.available_quantity}</strong> unit(s) available for selected dates</>
                    : <><XCircle size={16} /> Not available — all {availability.total_quantity} unit(s) are booked</>
                  }
                </div>
              )}
            </div>
          </div>

          {/* Book button */}
          {canBook ? (
            <div className="book-action">
              {equipment.available_quantity === 0 ? (
                <div className="unavail-msg">
                  <XCircle size={16} /> Currently unavailable for booking
                </div>
              ) : (
                <Link
                  to={`/book/${equipment.id}`}
                  state={{ equipment, defaultDates: checkDates }}
                  className="btn btn-primary btn-lg btn-block"
                >
                  <Calendar size={17} /> Book This Equipment
                </Link>
              )}
              {equipment.requires_payment && (
                <p className="payment-note">
                  ⚠️ External users will be charged Rs. {equipment.daily_rate}/day. Payment required before approval.
                </p>
              )}
            </div>
          ) : (
            <div className="unavail-msg">
              <Info size={16} /> Only students and external users can book equipment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}