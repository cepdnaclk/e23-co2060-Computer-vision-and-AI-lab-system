import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import {
  LayoutGrid, Calendar, Bell, LogOut, Menu, X,
  FlaskConical, ChevronRight, User, Home
} from 'lucide-react';
import './StudentLayout.css';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (user) {
      notificationAPI.getAll()
        .then(res => setNotifications(res.data.notifications))
        .catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard',   icon: <Home size={18} />,        label: 'Dashboard' },
    { to: '/catalog',     icon: <LayoutGrid size={18} />,  label: 'Browse Equipment' },
    { to: '/my-bookings', icon: <Calendar size={18} />,    label: 'My Bookings' },
    { to: '/profile',     icon: <User size={18} />,        label: 'My Profile' },
  ];

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon"><FlaskConical size={22} /></div>
          <div>
            <div className="logo-title">CV & AI Lab</div>
            <div className="logo-sub">University of Peradeniya</div>
          </div>
        </div>

        <div className="sidebar-section-label">Student Portal</div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight size={14} className="nav-chevron" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.student_id || user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-wrapper">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="topbar-right">
            <div className="notif-wrapper">
              <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {showNotif && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <span>Notifications</span>
                    {unreadCount > 0 && <span className="badge badge-pending">{unreadCount} new</span>}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No notifications yet</div>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`notif-item ${!n.is_read ? 'notif-unread' : ''}`}>
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-msg">{n.message}</div>
                        <div className="notif-time">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="topbar-user">
              <div className="user-avatar sm">{user?.name?.charAt(0).toUpperCase()}</div>
              <span>{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}