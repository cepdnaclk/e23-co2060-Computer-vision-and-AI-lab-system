-- Cleanup existing tables if any (Order matters due to Foreign Keys)
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS equipment_issue_reports;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS otp_verifications;
DROP TABLE IF EXISTS password_reset_otp;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student','officer', 'admin', 'staff')) NOT NULL
);

-- 2. Inventory / Items Table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    description TEXT,
    spec VARCHAR(150),
    fee VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available',
    image_url VARCHAR(255)
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
    image_url VARCHAR(255),
    video_url VARCHAR(255),
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
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Equipment damage, loss, and fault reports
CREATE TABLE equipment_issue_reports (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL REFERENCES inventory(id),
    reported_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issue_type VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    urgency VARCHAR(20) NOT NULL DEFAULT 'Normal',
    status VARCHAR(20) NOT NULL DEFAULT 'Open',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Password Reset OTP Table
CREATE TABLE password_reset_otp (
    email VARCHAR(200) PRIMARY KEY,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- 7. OTP Verifications Table (for registration flow)
CREATE TABLE otp_verifications (
    email VARCHAR(200) PRIMARY KEY,
    otp VARCHAR(6) NOT NULL,
    user_data JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- 8. Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    lead VARCHAR(100),
    supervisor VARCHAR(100),
    team_members TEXT,
    tags TEXT,
    year VARCHAR(20),
    status VARCHAR(50),
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

INSERT INTO projects (title, description, lead, supervisor, tags, year, status) VALUES
('DroneVision-X', 'Real-time object tracking for autonomous UAV navigation in complex urban environments.', 'Dr. Anika Reyes', 'Prof. Smith', 'SLAM, UAV, PyTorch', '2024-2025', 'Active'),
('MedScan AI', 'Deep learning pipeline for early-stage tumour detection in CT and MRI imagery.', 'Dr. Leon Falk', 'Prof. Smith', 'Medical, CNN, DICOM', '2024-2025', 'Active'),
('CrowdFlowNet', 'Real-time crowd density estimation and flow prediction via overhead camera feeds.', 'Sarah Kim', 'Dr. Anika Reyes', 'Detection, CCTV, AI', '2024', 'Active'),
('EdgeVision Kit', 'Lightweight CV models optimised for Raspberry Pi and Jetson Nano embedded platforms.', 'Marcus Chen', 'Dr. Leon Falk', 'Edge AI, TFLite, ONNX', '2023', 'Completed'),
('HistoScan', 'Automated histopathology slide analysis with explainable AI for clinical use.', 'Dr. Leon Falk', 'Prof. Smith', 'Pathology, XAI, WSI', '2023', 'Completed');

INSERT INTO inventory (name, category, description, spec, fee, status) VALUES
('High Performance Server', 'Computing', 'Graphic and computationally efficient high-performance computing server for deep learning training and inference workloads.', 'A100 GPU 80GB', 'TBD', 'available'),
('NVIDIA Jetson Orin Nano Developer Kit', 'Computing', 'Edge computing applications for robotics and automation.', '8GB RAM', 'Free', 'available'),
('Turtlebot 3 Burger', 'Robotics', 'Multi-agent systems research (navigation, mapping, SLAM).', 'ROS2', 'Free', 'available'),
('Intel RealSense Depth Camera D435i', 'Sensor', 'Obstacle/object detection for robotics.', '1920x1080', 'Free', 'in-use');

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@pdn.ac.lk', '$2a$10$eEw33m4yK0xH4mXz.9U5eOzX5v6s7R2Y1Q5a7V6w7y8z9a0b1c2d', 'admin'),
('Tech Officer', 'officer@pdn.ac.lk', '$2a$10$eEw33m4yK0xH4mXz.9U5eOzX5v6s7R2Y1Q5a7V6w7y8z9a0b1c2d', 'officer'),
('Student User', 'student@pdn.ac.lk', '$2a$10$eEw33m4yK0xH4mXz.9U5eOzX5v6s7R2Y1Q5a7V6w7y8z9a0b1c2d', 'student');