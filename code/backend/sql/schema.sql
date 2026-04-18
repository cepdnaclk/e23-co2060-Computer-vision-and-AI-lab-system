CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student','professor','officer')) NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'available'
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    request_type VARCHAR(100),
    resource VARCHAR(100),
    booking_date DATE,
    time_slot VARCHAR(50),
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    fee VARCHAR(50) DEFAULT 'TBD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);