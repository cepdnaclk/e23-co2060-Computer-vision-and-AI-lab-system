-- Cleanup existing tables if any (Order matters due to Foreign Keys)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student','professor','officer', 'admin', 'staff')) NOT NULL
);

-- 2. Inventory / Items Table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'available'
);

-- 3. Reservations Table (This is what your backend currently uses)
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(100),
    resource VARCHAR(100),
    booking_date DATE,
    time_slot VARCHAR(50),
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    fee VARCHAR(50) DEFAULT 'TBD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);