import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FlaskConical, Mail, Lock, User, Hash, Building } from 'lucide-react';
import './AuthPages.css';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    student_id: '', department: '', role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.token, res.data.user);
      toast.success('Account created! Welcome to CV & AI Lab.');
      navigate('/catalog');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
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
          <h1>Join the Lab<br /><span>Community.</span></h1>
          <p>Create your account to start booking lab equipment for your research and coursework projects.</p>
        </div>
        <div className="auth-stats">
          <div className="auth-stat"><strong>Free</strong><span>For students</span></div>
          <div className="auth-stat"><strong>Fast</strong><span>Instant booking</span></div>
          <div className="auth-stat"><strong>QR</strong><span>Pickup codes</span></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Fill in your details to get started</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="register-grid" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon-wrap">
                  <User size={16} className="input-icon" />
                  <input type="text" className="form-input with-icon" placeholder="Your full name"
                    value={form.name} onChange={set('name')} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={form.role} onChange={set('role')}>
                  <option value="student">Student (Internal)</option>
                  <option value="external">External User</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">University Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input type="email" className="form-input with-icon"
                  placeholder="yourname@student.pdn.ac.lk"
                  value={form.email} onChange={set('email')} required />
              </div>
            </div>

            <div className="register-grid" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <div className="input-icon-wrap">
                  <Hash size={16} className="input-icon" />
                  <input type="text" className="form-input with-icon" placeholder="E/19/001"
                    value={form.student_id} onChange={set('student_id')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <div className="input-icon-wrap">
                  <Building size={16} className="input-icon" />
                  <input type="text" className="form-input with-icon" placeholder="Computer Engineering"
                    value={form.department} onChange={set('department')} />
                </div>
              </div>
            </div>

            <div className="register-grid" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input type="password" className="form-input with-icon" placeholder="Min 6 characters"
                    value={form.password} onChange={set('password')} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input type="password" className="form-input with-icon" placeholder="Repeat password"
                    value={form.confirmPassword} onChange={set('confirmPassword')} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}