import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FlaskConical, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      if (['professor', 'admin', 'officer'].includes(res.data.user.role)) {
        navigate('/professor');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo"><FlaskConical size={28} /></div>
          <div>
            <div className="auth-brand-name">CV &amp; AI Lab System</div>
            <div className="auth-brand-sub">University of Peradeniya</div>
          </div>
        </div>
        <div className="auth-hero">
          <h1>Book Lab Equipment<br /><span>Seamlessly.</span></h1>
          <p>Access cameras, GPUs, drones, sensors and more through our integrated lab management portal.</p>
        </div>
        <div className="auth-stats">
          <div className="auth-stat"><strong>50+</strong><span>Equipment items</span></div>
          <div className="auth-stat"><strong>4</strong><span>User roles</span></div>
          <div className="auth-stat"><strong>24/7</strong><span>Booking system</span></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Enter your university credentials to continue</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-input with-icon"
                  placeholder="student@student.pdn.ac.lk"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input with-icon with-icon-right"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="icon-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>

          <div className="demo-credentials">
            <div className="demo-title">Demo Accounts</div>
            <div className="demo-list">
              <div><span>Student:</span> student@student.pdn.ac.lk</div>
              <div><span>Professor:</span> professor@pdn.ac.lk</div>
            </div>
            <div className="demo-pw">Password: password123</div>
          </div>
        </div>
      </div>
    </div>
  );
}