import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { equipmentAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Calendar, Info, CheckCircle, AlertTriangle,
  Package, ClipboardList, Send
} from 'lucide-react';
import './BookingForm.css';

export default function BookingForm() {
  const { equipmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState(location.state?.equipment || null);
  const [loading, setLoading] = useState(!equipment);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [step, setStep] = useState(1); // 1: details, 2: confirm

  const defaultDates = location.state?.defaultDates || {};
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    equipment_id: equipmentId,
    quantity: 1,
    start_date: defaultDates.start || '',
    end_date: defaultDates.end || '',
    purpose: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!equipment) {
      equipmentAPI.getById(equipmentId)
        .then(res => setEquipment(res.data.equipment))
        .catch(() => navigate('/catalog'))
        .finally(() => setLoading(false));
    }
  }, [equipmentId, equipment, navigate]);

  useEffect(() => {
    if (form.start_date && form.end_date && form.start_date <= form.end_date) {
      setCheckingAvail(true);
      equipmentAPI.checkAvailability(equipmentId, form.start_date, form.end_date)
        .then(res => setAvailability(res.data))
        .catch(() => {})
        .finally(() => setCheckingAvail(false));
    } else {
      setAvailability(null);
    }
  }, [form.start_date, form.end_date, equipmentId]);

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const calcDays = () => {
    if (!form.start_date || !form.end_date) return 0;
    return Math.max(1, Math.ceil((new Date(form.end_date) - new Date(form.start_date)) / (1000 * 60 * 60 * 24)) + 1);
  };

  const calcFee = () => {
    if (!equipment?.requires_payment || user?.role !== 'external') return 0;
    return equipment.daily_rate * calcDays() * form.quantity;
  };

  const validate = () => {
    const e = {};
    if (!form.start_date) e.start_date = 'Start date is required';
    if (!form.end_date)   e.end_date   = 'End date is required';
    if (form.start_date && form.end_date && form.start_date > form.end_date)
      e.end_date = 'End date must be after start date';
    if (!form.purpose.trim()) e.purpose = 'Purpose is required';
    if (form.purpose.trim().length < 20)
      e.purpose = 'Please describe your purpose in at least 20 characters';
    if (availability && parseInt(form.quantity) > availability.available_quantity)
      e.quantity = `Only ${availability.available_quantity} unit(s) available`;
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await bookingAPI.create({ ...form, quantity: parseInt(form.quantity) });
      toast.success('Booking submitted! Awaiting professor approval.');
      navigate(`/bookings/${res.data.booking.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!equipment) return null;

  const days = calcDays();
  const fee = calcFee();

  return (
    <div className="booking-form-page fade-up">
      <button className="back-btn" onClick={() => step === 1 ? navigate(`/equipment/${equipmentId}`) : setStep(1)}>
        <ArrowLeft size={16} /> {step === 1 ? 'Back to Equipment' : 'Edit Details'}
      </button>

      {/* Progress */}
      <div className="booking-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-num">1</div>
          <span>Booking Details</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-num">2</div>
          <span>Confirm &amp; Submit</span>
        </div>
      </div>

      <div className="booking-layout">
        {/* Form / Confirm */}
        <div className="booking-main">
          {step === 1 ? (
            <div className="card">
              <div className="card-body">
                <h2 className="form-section-title"><ClipboardList size={18} /> Booking Details</h2>

                {/* Date row */}
                <div className="date-row">
                  <div className="form-group">
                    <label className="form-label">Start Date *</label>
                    <input type="date" className={`form-input ${errors.start_date ? 'input-error' : ''}`}
                      min={today} value={form.start_date} onChange={set('start_date')} />
                    {errors.start_date && <div className="form-error">{errors.start_date}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date *</label>
                    <input type="date" className={`form-input ${errors.end_date ? 'input-error' : ''}`}
                      min={form.start_date || today} value={form.end_date} onChange={set('end_date')} />
                    {errors.end_date && <div className="form-error">{errors.end_date}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input type="number" className={`form-input ${errors.quantity ? 'input-error' : ''}`}
                      min={1} max={equipment.available_quantity || 1}
                      value={form.quantity} onChange={set('quantity')} />
                    {errors.quantity && <div className="form-error">{errors.quantity}</div>}
                  </div>
                </div>

                {/* Availability indicator */}
                {checkingAvail && (
                  <div className="avail-checking"><span className="btn-spinner sm" /> Checking availability...</div>
                )}
                {!checkingAvail && availability && form.start_date && form.end_date && (
                  <div className={`avail-result ${availability.is_available ? 'avail-yes' : 'avail-no'}`}>
                    {availability.is_available
                      ? <><CheckCircle size={15} /> {availability.available_quantity} unit(s) available for selected dates ({days} day{days !== 1 ? 's' : ''})</>
                      : <><AlertTriangle size={15} /> Not available for selected dates — please choose different dates</>
                    }
                  </div>
                )}

                {/* Purpose */}
                <div className="form-group" style={{ marginTop: 20 }}>
                  <label className="form-label">Purpose / Project Description *</label>
                  <textarea
                    className={`form-textarea ${errors.purpose ? 'input-error' : ''}`}
                    placeholder="Describe the project or coursework for which you need this equipment. E.g. 'Final year project on object detection using YOLOv8 — need camera for dataset collection...'"
                    value={form.purpose}
                    onChange={set('purpose')}
                    rows={5}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    {errors.purpose
                      ? <div className="form-error">{errors.purpose}</div>
                      : <div />
                    }
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{form.purpose.length} chars (min 20)</div>
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label">Additional Notes <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any special requirements, preferred pickup time, etc."
                    value={form.notes}
                    onChange={set('notes')}
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn btn-ghost" onClick={() => navigate(`/equipment/${equipmentId}`)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleNext}
                    disabled={availability && !availability.is_available}
                  >
                    Review Booking <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Confirm */
            <div className="card confirm-card">
              <div className="card-body">
                <h2 className="form-section-title"><CheckCircle size={18} /> Confirm Your Booking</h2>
                <p className="confirm-note">
                  Please review the details below. Once submitted, your booking will be reviewed by a professor.
                  You'll receive a notification when it's approved or rejected.
                </p>

                <div className="confirm-rows">
                  <div className="confirm-row"><span>Equipment</span><strong>{equipment.name}</strong></div>
                  <div className="confirm-row"><span>Model</span><strong>{equipment.model}</strong></div>
                  <div className="confirm-row"><span>Quantity</span><strong>{form.quantity} unit(s)</strong></div>
                  <div className="confirm-row"><span>From</span><strong>{new Date(form.start_date).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
                  <div className="confirm-row"><span>To</span><strong>{new Date(form.end_date).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
                  <div className="confirm-row"><span>Duration</span><strong>{days} day{days !== 1 ? 's' : ''}</strong></div>
                  <div className="confirm-row"><span>Purpose</span><strong style={{ maxWidth: 280, textAlign: 'right' }}>{form.purpose}</strong></div>
                  {fee > 0 && (
                    <div className="confirm-row fee-row"><span>Total Fee</span><strong>Rs. {fee.toFixed(2)}</strong></div>
                  )}
                  {fee === 0 && (
                    <div className="confirm-row"><span>Cost</span><strong style={{ color: 'var(--success)' }}>Free</strong></div>
                  )}
                </div>

                <div className="confirm-warning">
                  <Info size={15} />
                  <div>
                    <strong>Important:</strong> You'll receive a QR code only after professor approval.
                    Show the QR code to the lab officer when picking up the equipment.
                    {fee > 0 && ' Payment must be completed before equipment can be collected.'}
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>Edit Details</button>
                  <button className="btn btn-accent btn-lg" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <><span className="btn-spinner" /> Submitting...</> : <><Send size={15} /> Submit Booking</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Equipment summary */}
        <div className="booking-sidebar">
          <div className="card">
            <div className="card-body">
              <div className="eq-summary-img">
                {equipment.image_url
                  ? <img src={equipment.image_url} alt={equipment.name} />
                  : <div className="eq-sum-placeholder"><Package size={32} /></div>
                }
              </div>
              <h3 className="eq-summary-name">{equipment.name}</h3>
              <p className="eq-summary-model">{equipment.model}</p>
              <div className="eq-summary-meta">
                <div className="info-row">
                  <span className="info-label">Location</span>
                  <span className="info-value">{equipment.location}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Available</span>
                  <span className="info-value" style={{ color: 'var(--success)' }}>{equipment.available_quantity} unit(s)</span>
                </div>
              </div>

              {days > 0 && (
                <div className="duration-badge">
                  <Calendar size={14} />
                  {days} day{days !== 1 ? 's' : ''} selected
                  {fee > 0 && <span className="fee-tag">Rs. {fee.toFixed(2)}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="booking-process-info">
            <div className="process-title">Booking Process</div>
            {[
              ['Submit request', 'Your booking goes to the approval queue'],
              ['Professor reviews', 'Approved or rejected with reason'],
              ['Get QR code', 'Emailed after approval'],
              ['Pick up equipment', 'Show QR to lab officer'],
            ].map(([title, desc], i) => (
              <div key={i} className="process-step">
                <div className="process-num">{i + 1}</div>
                <div>
                  <div className="process-step-title">{title}</div>
                  <div className="process-step-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}