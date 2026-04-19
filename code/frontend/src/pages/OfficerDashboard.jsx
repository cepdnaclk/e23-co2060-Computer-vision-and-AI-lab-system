import React, { useState, useEffect, useRef } from 'react';
import { bookingAPI, equipmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  QrCode, Package, CheckCircle, RotateCcw, Search,
  LogOut, FlaskConical, Plus, Edit2, AlertCircle,
  Camera, Cpu, Wind, Activity, X
} from 'lucide-react';
import './OfficerDashboard.css';

// ─── QR Scanner (uses jsQR via camera) ─────────────────────────────────────
function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const animRef = useRef(null);

  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scan();
        }
      } catch {
        setError('Camera access denied. Please enter booking ref manually.');
      }
    })();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const scan = () => {
    // jsQR scanning loop — simplified fallback since jsQR needs to be loaded
    // In production add: import jsQR from 'jsqr';
    // For now we just show the camera preview
    animRef.current = requestAnimationFrame(scan);
  };

  return (
    <div className="qr-scanner-overlay" onClick={onClose}>
      <div className="qr-scanner-box" onClick={e => e.stopPropagation()}>
        <div className="qr-scanner-header">
          <h3><QrCode size={18} /> Scan QR Code</h3>
          <button className="icon-close" onClick={onClose}><X size={18} /></button>
        </div>
        {error
          ? <div className="qr-error"><AlertCircle size={20} />{error}</div>
          : (
            <div className="video-wrap">
              <video ref={videoRef} className="qr-video" playsInline />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="scan-frame" />
              <p className="scan-hint">Point camera at QR code</p>
            </div>
          )
        }
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label">Or enter Booking Reference manually</label>
          <ManualRef onScan={onScan} />
        </div>
      </div>
    </div>
  );
}

function ManualRef({ onScan }) {
  const [ref, setRef] = useState('');
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input className="form-input" placeholder="BK-2024-00001"
        value={ref} onChange={e => setRef(e.target.value.toUpperCase())}
        onKeyDown={e => e.key === 'Enter' && ref && onScan(ref)}
      />
      <button className="btn btn-primary" onClick={() => ref && onScan(ref)}>
        <Search size={14} />
      </button>
    </div>
  );
}

// ─── Equipment Form Modal ────────────────────────────────────────────────────
function EquipmentModal({ item, categories, onSave, onClose }) {
  const [form, setForm] = useState(item || {
    category_id: '', name: '', model: '', description: '',
    total_quantity: 1, location: '', requires_payment: false,
    daily_rate: 0, condition: 'good', image_url: ''
  });
  const [saving, setSaving] = useState(false);

  const set = f => e => setForm({ ...form, [f]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.category_id) { toast.error('Name and category are required'); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Edit Equipment' : 'Add Equipment'}</h3>
          <button className="icon-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="eq-form-grid">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category_id} onChange={set('category_id')}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Condition</label>
            <select className="form-select" value={form.condition} onChange={set('condition')}>
              {['excellent','good','fair','under_maintenance'].map(c =>
                <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Equipment Name *</label>
            <input className="form-input" placeholder="e.g. Canon EOS R5"
              value={form.name} onChange={set('name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Model</label>
            <input className="form-input" placeholder="e.g. Canon EOS R5 Mirrorless"
              value={form.model} onChange={set('model')} />
          </div>
          <div className="form-group">
            <label className="form-label">Total Quantity</label>
            <input type="number" min={1} className="form-input"
              value={form.total_quantity} onChange={set('total_quantity')} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="e.g. Lab Room 101"
              value={form.location} onChange={set('location')} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3}
              placeholder="Brief description of specs and usage..."
              value={form.description} onChange={set('description')} />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" placeholder="https://..."
              value={form.image_url} onChange={set('image_url')} />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Rate (Rs.)</label>
            <input type="number" min={0} className="form-input"
              value={form.daily_rate} onChange={set('daily_rate')} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="toggle-label">
              <input type="checkbox"
                checked={form.requires_payment}
                onChange={e => setForm({ ...form, requires_payment: e.target.checked })}
              />
              Requires payment (for external users)
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="btn-spinner" /> : item ? 'Save Changes' : 'Add Equipment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Officer Dashboard ──────────────────────────────────────────────────
export default function OfficerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pickups');
  const [bookings, setBookings]     = useState([]);
  const [equipment, setEquipment]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(null); // null | 'new' | equipObj
  const [processing, setProcessing] = useState(null);
  const [eqSearch, setEqSearch]     = useState('');

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'pickups') {
        const res = await bookingAPI.getAll({ status: 'approved', limit: 50 });
        setBookings(res.data.bookings);
      } else if (tab === 'returns') {
        const res = await bookingAPI.getAll({ status: 'picked_up', limit: 50 });
        setBookings(res.data.bookings);
      } else if (tab === 'inventory') {
        const [eqRes, catRes] = await Promise.all([
          equipmentAPI.getAll({}),
          equipmentAPI.getCategories(),
        ]);
        setEquipment(eqRes.data.equipment);
        setCategories(catRes.data.categories);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(activeTab); }, [activeTab]);

  // Lookup booking by ref (after QR scan)
  const handleQRScan = async (bookingRef) => {
    setShowScanner(false);
    try {
      // Search by ref in current list first
      const found = bookings.find(b => b.booking_ref === bookingRef.trim());
      if (found) {
        toast.success(`Found: ${found.equipment_name} — ${found.student_name}`);
        if (window.confirm(`Mark booking ${bookingRef} as PICKED UP?`)) {
          await markPickedUp(found.id);
        }
      } else {
        toast.error(`Booking ${bookingRef} not found in approved list.`);
      }
    } catch (err) {
      toast.error('Error processing QR scan');
    }
  };

  const markPickedUp = async (bookingId) => {
    setProcessing(bookingId);
    try {
      await bookingAPI.markPickedUp(bookingId);
      toast.success('Marked as picked up!');
      fetchData(activeTab);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setProcessing(null);
    }
  };

  const handleSaveEquipment = async (form) => {
    if (showEquipModal === 'new') {
      await equipmentAPI.create(form);
      toast.success('Equipment added!');
    } else {
      await equipmentAPI.update(showEquipModal.id, form);
      toast.success('Equipment updated!');
    }
    fetchData('inventory');
  };

  const filteredEq = equipment.filter(e =>
    !eqSearch || e.name.toLowerCase().includes(eqSearch.toLowerCase()) ||
    e.category_name?.toLowerCase().includes(eqSearch.toLowerCase())
  );

  const tabs = [
    { id: 'pickups',   label: 'Pending Pickups' },
    { id: 'returns',   label: 'Pending Returns' },
    { id: 'inventory', label: 'Inventory' },
  ];

  return (
    <div className="officer-page">
      {/* Top header */}
      <header className="officer-header">
        <div className="officer-brand">
          <div className="logo-icon sm"><FlaskConical size={16} /></div>
          <div>
            <span className="brand-name">CV &amp; AI Lab</span>
            <span className="brand-role">Officer Portal</span>
          </div>
        </div>

        <div className="officer-tabs">
          {tabs.map(t => (
            <button key={t.id}
              className={`off-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >{t.label}</button>
          ))}
        </div>

        <div className="officer-actions">
          <button className="btn btn-accent btn-sm" onClick={() => setShowScanner(true)}>
            <QrCode size={15} /> Scan QR
          </button>
          <div className="user-pill">
            <div className="user-avatar sm">{user?.name?.charAt(0)}</div>
            <span>{user?.name}</span>
          </div>
          <button className="icon-btn" onClick={() => { logout(); navigate('/login'); }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="officer-main">

        {/* ── Pickups tab ─────────────────────────────── */}
        {activeTab === 'pickups' && (
          <>
            <div className="page-header">
              <h1>Pending Equipment Pickups</h1>
              <p>Approved bookings waiting for student to collect</p>
            </div>
            {loading ? <SkeletonList /> : bookings.length === 0 ? (
              <div className="empty-state"><CheckCircle size={40} /><h3>All caught up!</h3><p>No approved bookings waiting for pickup.</p></div>
            ) : (
              <div className="officer-table">
                <div className="ot-header">
                  <span>Booking</span><span>Student</span><span>Equipment</span>
                  <span>Dates</span><span>Approved</span><span>Action</span>
                </div>
                {bookings.map(b => (
                  <div key={b.id} className="ot-row">
                    <span className="ot-ref">{b.booking_ref}</span>
                    <div><div className="ot-name">{b.student_name}</div><div className="ot-sub">{b.student_id}</div></div>
                    <div><div className="ot-name">{b.equipment_name}</div><div className="ot-sub">{b.quantity} unit(s)</div></div>
                    <div className="ot-sub">
                      {new Date(b.start_date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
                      {' → '}
                      {new Date(b.end_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                    </div>
                    <div className="ot-sub">{b.approved_by_name || '—'}</div>
                    <button className="btn btn-primary btn-sm"
                      disabled={processing === b.id}
                      onClick={() => markPickedUp(b.id)}>
                      {processing === b.id ? <span className="btn-spinner sm" /> : <><CheckCircle size={13}/> Picked Up</>}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Returns tab ─────────────────────────────── */}
        {activeTab === 'returns' && (
          <>
            <div className="page-header">
              <h1>Pending Equipment Returns</h1>
              <p>Equipment currently with students — confirm when returned</p>
            </div>
            {loading ? <SkeletonList /> : bookings.length === 0 ? (
              <div className="empty-state"><RotateCcw size={40} /><h3>No active loans</h3><p>No equipment is currently checked out.</p></div>
            ) : (
              <div className="officer-table">
                <div className="ot-header">
                  <span>Booking</span><span>Student</span><span>Equipment</span>
                  <span>Due Date</span><span>Days Out</span><span>Action</span>
                </div>
                {bookings.map(b => {
                  const daysOut = Math.ceil((new Date() - new Date(b.start_date)) / (1000*60*60*24));
                  const overdue = new Date(b.end_date) < new Date();
                  return (
                    <div key={b.id} className={`ot-row ${overdue ? 'overdue' : ''}`}>
                      <span className="ot-ref">{b.booking_ref}</span>
                      <div><div className="ot-name">{b.student_name}</div><div className="ot-sub">{b.student_id}</div></div>
                      <div><div className="ot-name">{b.equipment_name}</div><div className="ot-sub">{b.quantity} unit(s)</div></div>
                      <div className="ot-sub" style={{ color: overdue ? 'var(--error)' : 'inherit' }}>
                        {new Date(b.end_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                        {overdue && ' ⚠️ OVERDUE'}
                      </div>
                      <div className="ot-sub">{daysOut} day{daysOut !== 1 ? 's' : ''}</div>
                      <button className="btn btn-sm" style={{ background: 'var(--success)', color:'#fff' }}
                        disabled={processing === b.id}
                        onClick={async () => {
                          setProcessing(b.id);
                          try {
                            await bookingAPI.markReturned(b.id);
                            toast.success('Marked as returned!');
                            fetchData('returns');
                          } catch { toast.error('Failed'); }
                          finally { setProcessing(null); }
                        }}>
                        {processing === b.id ? <span className="btn-spinner sm" /> : <><RotateCcw size={13}/> Returned</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Inventory tab ─────────────────────────────── */}
        {activeTab === 'inventory' && (
          <>
            <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <h1>Equipment Inventory</h1>
                <p>Manage lab equipment catalog</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowEquipModal('new')}>
                <Plus size={15} /> Add Equipment
              </button>
            </div>

            <div className="inv-search">
              <Search size={15} style={{ color:'var(--text-muted)', flexShrink:0 }} />
              <input className="form-input" placeholder="Search equipment..."
                value={eqSearch} onChange={e => setEqSearch(e.target.value)} />
            </div>

            {loading ? <SkeletonList /> : (
              <div className="inv-grid">
                {filteredEq.map(eq => (
                  <div key={eq.id} className="inv-card">
                    <div className="inv-card-top">
                      <div className="inv-category">{eq.category_name}</div>
                      <span className={`badge ${eq.is_active ? 'badge-approved' : 'badge-cancelled'}`}>
                        {eq.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="inv-name">{eq.name}</div>
                    <div className="inv-model">{eq.model}</div>
                    <div className="inv-stats">
                      <div className="inv-stat">
                        <span>Total</span><strong>{eq.total_quantity}</strong>
                      </div>
                      <div className="inv-stat">
                        <span>Available</span>
                        <strong style={{ color: eq.available_quantity > 0 ? 'var(--success)' : 'var(--error)' }}>
                          {eq.available_quantity}
                        </strong>
                      </div>
                      <div className="inv-stat">
                        <span>Condition</span><strong>{eq.condition}</strong>
                      </div>
                    </div>
                    <div className="inv-location">📍 {eq.location}</div>
                    <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 12 }}
                      onClick={() => setShowEquipModal(eq)}>
                      <Edit2 size={13} /> Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}

      {showEquipModal && (
        <EquipmentModal
          item={showEquipModal === 'new' ? null : showEquipModal}
          categories={categories}
          onSave={handleSaveEquipment}
          onClose={() => setShowEquipModal(null)}
        />
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {[...Array(5)].map((_,i) => (
        <div key={i} style={{
          height:64, borderRadius:'var(--radius)',
          background:'linear-gradient(90deg,var(--border) 25%,var(--surface-2) 50%,var(--border) 75%)',
          backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite'
        }} />
      ))}
    </div>
  );
}