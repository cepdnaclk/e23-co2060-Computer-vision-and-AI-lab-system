-- Cleanup existing tables if any (Order matters due to Foreign Keys)
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS people;
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
    spec VARCHAR(150),
    fee VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available'
);

-- 3. People Table
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(150),
    dept VARCHAR(100),
    research VARCHAR(150),
    type VARCHAR(20) CHECK (type IN ('staff','student')) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. News Table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    title VARCHAR(150) NOT NULL,
    content TEXT,
    published_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Reservations Table (This is what your backend currently uses)
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

-- 6. Password Reset OTP Table
CREATE TABLE password_reset_otp (
    email VARCHAR(200) PRIMARY KEY,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- Seed public demo content
INSERT INTO people (name, title, dept, research, type, sort_order) VALUES
('Dr. Anika Reyes', 'Lab Director / Professor', 'Computer Science', '3D Vision & UAVs', 'staff', 1),
('Dr. Leon Falk', 'Senior Researcher / Sr. Lecturer', 'Biomedical Eng.', 'Medical Imaging', 'staff', 2),
('Priya Nair', 'Research Staff', 'Computer Science', 'Video Analytics', 'staff', 3),
('Sarah Kim', 'PhD Candidate', 'Computer Science', 'Autonomous Drones', 'student', 4),
('Marcus Chen', 'PhD Candidate', 'Computer Science', 'Edge AI', 'student', 5),
('James Okafor', 'Lab Engineer', 'IT Infrastructure', 'GPU Infrastructure', 'staff', 6),
('Ravi Perera', 'MPhil Candidate', 'Electrical Eng.', 'Robotics Vision', 'student', 7),
('Nadia Hassan', 'BSc Research Assistant', 'Computer Science', 'Image Segmentation', 'student', 8);

INSERT INTO news (category, title, content, published_date) VALUES
('Achievement', 'Lab Wins Best Paper Award at CVPR 2025', 'DroneVision-X research recognised internationally at the premier CV conference.', '2025-03-10'),
('Funding', 'NSF Grant Awarded for UAV Vision Research', '$450,000 grant to fund a 3-year autonomous urban navigation study.', '2025-02-24'),
('Event', 'AI & Vision Workshop — April 2025', 'Open registration now available. Limited seats. Workshops by leading researchers.', '2025-02-15'),
('Media', 'DroneVision-X Featured in Tech Digest', 'National media coverage of our live UAV tracking demonstration.', '2025-01-20');