-- ============================================
-- CV & AI Lab System - Equipment Booking Schema
-- ============================================

-- Users table (students, staff, admin, officer, professor)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'external', 'professor', 'officer', 'admin')),
    student_id VARCHAR(20),
    nic VARCHAR(20),           -- For external users
    nic_verified BOOLEAN DEFAULT FALSE,
    department VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Equipment categories
CREATE TABLE IF NOT EXISTS equipment_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50)           -- e.g. 'camera', 'gpu', 'drone'
);

-- Equipment inventory
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES equipment_categories(id),
    name VARCHAR(150) NOT NULL,
    model VARCHAR(100),
    description TEXT,
    image_url VARCHAR(255),
    total_quantity INTEGER NOT NULL DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'under_maintenance')),
    location VARCHAR(100),
    requires_payment BOOLEAN DEFAULT FALSE,
    daily_rate DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Equipment bookings
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_ref VARCHAR(20) UNIQUE NOT NULL,  -- e.g. BK-2024-00001
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    equipment_id INTEGER REFERENCES equipment(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'picked_up', 'returned')),
    approved_by INTEGER REFERENCES users(id),  -- professor/admin who approved
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    total_fee DECIMAL(10, 2) DEFAULT 0.00,
    payment_status VARCHAR(20) DEFAULT 'not_required'
        CHECK (payment_status IN ('not_required', 'pending', 'paid', 'waived')),
    qr_code VARCHAR(255),      -- QR code token after approval
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Booking status history / audit log
CREATE TABLE IF NOT EXISTS booking_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    changed_by INTEGER REFERENCES users(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    note TEXT,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info'
        CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    booking_id INTEGER REFERENCES bookings(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Seed Data
-- =====================

INSERT INTO equipment_categories (name, description, icon) VALUES
('Cameras', 'DSLR, mirrorless, and action cameras', 'camera'),
('GPUs', 'Graphics processing units for ML workloads', 'cpu'),
('Drones', 'Aerial photography and research drones', 'drone'),
('Sensors', 'Various sensors for data collection', 'activity'),
('Lenses', 'Camera lenses and optics', 'aperture'),
('Lighting', 'Studio and field lighting equipment', 'sun');

INSERT INTO equipment (category_id, name, model, description, total_quantity, available_quantity, location, requires_payment, daily_rate) VALUES
(1, 'Canon EOS R5', 'Canon EOS R5 Mirrorless', '45MP full-frame mirrorless camera, 8K RAW video', 3, 3, 'Lab Room 101', FALSE, 0),
(1, 'Sony A7 IV', 'Sony Alpha A7 IV', '33MP full-frame mirrorless, excellent low-light', 2, 2, 'Lab Room 101', FALSE, 0),
(1, 'GoPro Hero 12', 'GoPro HERO12 Black', 'Action camera, waterproof, 5.3K video', 5, 5, 'Equipment Cabinet A', FALSE, 0),
(2, 'NVIDIA RTX 4090', 'NVIDIA GeForce RTX 4090', '24GB VRAM, ideal for large model training', 2, 2, 'Server Room', FALSE, 0),
(2, 'NVIDIA A100', 'NVIDIA A100 80GB', 'Data center GPU for large-scale AI research', 1, 1, 'Server Room', FALSE, 0),
(3, 'DJI Phantom 4', 'DJI Phantom 4 Pro V2', '20MP camera drone, 30 min flight time', 2, 2, 'Storage Room B', FALSE, 0),
(3, 'DJI Mini 3 Pro', 'DJI Mini 3 Pro', 'Lightweight foldable drone under 249g', 3, 3, 'Storage Room B', FALSE, 0),
(4, 'LiDAR Sensor', 'Velodyne VLP-16', '3D LiDAR scanner, 16 channels, 100m range', 1, 1, 'Lab Room 102', FALSE, 0),
(4, 'Depth Camera', 'Intel RealSense D435i', 'RGB-D depth camera with IMU', 4, 4, 'Lab Room 102', FALSE, 0);

-- Test users (password: "password123" - bcrypt hash)
INSERT INTO users (name, email, password_hash, role, student_id, department) VALUES
('Test Student', 'student@student.pdn.ac.lk', '$2b$10$YourHashHere', 'student', 'E/19/001', 'Computer Engineering'),
('Prof. Admin', 'professor@pdn.ac.lk', '$2b$10$YourHashHere', 'professor', NULL, 'Computer Engineering'),
('Lab Officer', 'officer@pdn.ac.lk', '$2b$10$YourHashHere', 'officer', NULL, 'Lab Administration');