-- ============================================================
-- CV & AI Lab — Migration v2
-- Run this on top of schema.sql (existing tables stay intact)
-- ============================================================

-- Nothing new needed for consultations, publications, fees —
-- they were already in schema.sql.
-- This migration adds any missing indexes and a few helper views.

-- ── Extra indexes for performance ────────────────────────────
CREATE INDEX IF NOT EXISTS idx_consultations_student ON consultations(student_id);
CREATE INDEX IF NOT EXISTS idx_consultations_staff   ON consultations(staff_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status  ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_publications_year     ON publications(year DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_qr           ON equipment_bookings(qr_code) WHERE qr_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_fee          ON equipment_bookings(total_fee) WHERE total_fee > 0;
CREATE INDEX IF NOT EXISTS idx_gpu_status            ON gpu_requests(status);

-- ── View: pending approvals dashboard ────────────────────────
CREATE OR REPLACE VIEW v_pending_approvals AS
SELECT
  'equipment_booking' AS type,
  eb.id,
  eb.created_at,
  u.first_name || ' ' || u.last_name AS requester,
  e.name  AS subject,
  eb.status
FROM equipment_bookings eb
JOIN users     u ON u.id = eb.user_id
JOIN equipment e ON e.id = eb.equipment_id
WHERE eb.status = 'pending'

UNION ALL

SELECT
  'space_reservation' AS type,
  sr.id,
  sr.created_at,
  u.first_name || ' ' || u.last_name AS requester,
  ls.name AS subject,
  sr.status
FROM space_reservations sr
JOIN users      u ON u.id = sr.user_id
JOIN lab_spaces ls ON ls.id = sr.space_id
WHERE sr.status = 'pending'

UNION ALL

SELECT
  'gpu_request' AS type,
  gr.id,
  gr.created_at,
  u.first_name || ' ' || u.last_name AS requester,
  gr.job_name AS subject,
  gr.status::text
FROM gpu_requests gr
JOIN users u ON u.id = gr.user_id
WHERE gr.status = 'pending'

UNION ALL

SELECT
  'consultation' AS type,
  c.id,
  c.created_at,
  u.first_name || ' ' || u.last_name AS requester,
  c.topic AS subject,
  c.status
FROM consultations c
JOIN users u ON u.id = c.student_id
WHERE c.status = 'pending'

ORDER BY created_at DESC;

-- ── View: equipment utilisation rate ─────────────────────────
CREATE OR REPLACE VIEW v_equipment_utilisation AS
SELECT
  e.id,
  e.name,
  e.category,
  e.status,
  COUNT(eb.id)                                               AS total_bookings,
  COUNT(eb.id) FILTER (WHERE eb.status IN ('active','returned','approved')) AS successful,
  ROUND(
    COUNT(eb.id) FILTER (WHERE eb.status IN ('active','returned','approved'))::numeric
    / NULLIF(COUNT(eb.id), 0) * 100, 1
  ) AS success_rate_pct
FROM equipment e
LEFT JOIN equipment_bookings eb ON eb.equipment_id = e.id
GROUP BY e.id, e.name, e.category, e.status
ORDER BY total_bookings DESC;

-- ── View: user activity summary ───────────────────────────────
CREATE OR REPLACE VIEW v_user_activity AS
SELECT
  u.id,
  u.first_name || ' ' || u.last_name AS full_name,
  u.email, u.role, u.status,
  COUNT(DISTINCT eb.id) AS equipment_bookings,
  COUNT(DISTINCT sr.id) AS space_reservations,
  COUNT(DISTINCT gr.id) AS gpu_requests,
  COUNT(DISTINCT c.id)  AS consultations,
  COALESCE(SUM(eb.total_fee), 0) AS total_fees_paid
FROM users u
LEFT JOIN equipment_bookings eb ON eb.user_id = u.id AND eb.status = 'returned'
LEFT JOIN space_reservations sr ON sr.user_id = u.id
LEFT JOIN gpu_requests       gr ON gr.user_id = u.id
LEFT JOIN consultations       c ON c.student_id = u.id
GROUP BY u.id, u.first_name, u.last_name, u.email, u.role, u.status;

-- ── Seed: Lab spaces ─────────────────────────────────────────
INSERT INTO lab_spaces (name, description, capacity, location) VALUES
  ('Lab Room A', 'Main workstation area with 20 PCs and GPU workstations', 20, 'Engineering Block B, Room 204'),
  ('Lab Room B', 'Hardware and robotics experimentation room', 12, 'Engineering Block B, Room 206'),
  ('Meeting Room', 'Discussion room with projector and whiteboard', 8, 'Engineering Block B, Room 202'),
  ('Server Room (Supervised)', 'Supervised access to GPU servers. Officer must be present.', 4, 'Engineering Block B, Room 210')
ON CONFLICT DO NOTHING;

-- ── Seed: Sample equipment ───────────────────────────────────
INSERT INTO equipment (name, category, description, serial_no, quantity, location, status) VALUES
  ('Canon EOS 5D Mark IV', 'camera', 'Full-frame DSLR camera with 30.4MP sensor', 'SN-CAM-001', 2, 'Lab Room A, Cabinet 1', 'available'),
  ('DJI Matrice 300 RTK', 'drone', 'Industrial-grade UAV with triple payload capacity', 'SN-DRN-001', 1, 'Lab Room B, Cabinet 3', 'available'),
  ('Intel RealSense D435i', 'sensor', 'Depth and tracking camera with IMU', 'SN-SEN-001', 3, 'Lab Room A, Cabinet 2', 'available'),
  ('NVIDIA Jetson AGX Orin', 'gpu', 'Edge AI computing module — 275 TOPS', 'SN-GPU-001', 2, 'Lab Room A, Cabinet 4', 'available'),
  ('Universal Robots UR5e', 'robotic', 'Collaborative robotic arm, 5kg payload, 850mm reach', 'SN-ROB-001', 1, 'Lab Room B', 'available'),
  ('Velodyne VLP-16 LiDAR', 'sensor', '3D LiDAR sensor, 360° horizontal FOV', 'SN-SEN-002', 1, 'Lab Room B, Cabinet 1', 'available')
ON CONFLICT DO NOTHING;