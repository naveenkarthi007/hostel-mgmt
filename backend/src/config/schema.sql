-- ============================================================
--  Bannari Amman Institute of Technology
--  Hostel Management System – Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS hostel_mgmt;
USE hostel_mgmt;

-- ── Users (Admin + Students) ──────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  password    VARCHAR(255) NULL,
  google_id   VARCHAR(255) DEFAULT NULL,
  role        ENUM('admin','student') DEFAULT 'student',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Rooms ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  room_number  VARCHAR(20) NOT NULL UNIQUE,
  block        ENUM('A','B','C','D') NOT NULL,
  floor        TINYINT NOT NULL DEFAULT 1,
  capacity     TINYINT NOT NULL DEFAULT 3,
  occupied     TINYINT NOT NULL DEFAULT 0,
  room_type    ENUM('single','double','triple') DEFAULT 'triple',
  status       ENUM('available','occupied','maintenance','reserved') DEFAULT 'available',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Students ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT REFERENCES users(id) ON DELETE SET NULL,
  name         VARCHAR(120) NOT NULL,
  register_no  VARCHAR(30) NOT NULL UNIQUE,
  department   VARCHAR(60) NOT NULL,
  year         TINYINT NOT NULL CHECK (year BETWEEN 1 AND 4),
  phone        VARCHAR(15),
  email        VARCHAR(120),
  address      TEXT,
  room_id      INT REFERENCES rooms(id) ON DELETE SET NULL,
  fee_status   ENUM('paid','pending','partial') DEFAULT 'pending',
  joined_date  DATE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Allocations ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allocations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  room_id      INT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  allocated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  vacated_at   DATETIME DEFAULT NULL,
  is_active    BOOLEAN DEFAULT TRUE
);

-- ── Complaints ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT REFERENCES students(id) ON DELETE SET NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  category     ENUM('plumbing','electrical','carpentry','housekeeping','network','mess','other') DEFAULT 'other',
  status       ENUM('pending','in_progress','resolved') DEFAULT 'pending',
  priority     ENUM('low','medium','high') DEFAULT 'medium',
  admin_note   TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Notices ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notices (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  content     TEXT,
  category    ENUM('general','urgent','maintenance','accounts','events') DEFAULT 'general',
  target      ENUM('all','block_a','block_b','block_c','block_d') DEFAULT 'all',
  posted_by   INT REFERENCES users(id),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Visitors ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitors (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  visitor_name VARCHAR(120) NOT NULL,
  relation    VARCHAR(50),
  phone       VARCHAR(15),
  id_proof    VARCHAR(50),
  student_id  INT REFERENCES students(id),
  in_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  out_time    DATETIME DEFAULT NULL,
  status      ENUM('inside','exited') DEFAULT 'inside'
);

-- ── Seed: Default Admin ────────────────────────────────────
-- Password: Admin@1234 (bcrypt hash)
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Chief Warden', 'admin@baithotel.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- ── Seed: Sample Rooms ─────────────────────────────────────
INSERT IGNORE INTO rooms (room_number, block, floor, capacity, occupied, room_type, status) VALUES
('A-101','A',1,3,3,'triple','occupied'),
('A-102','A',1,3,2,'triple','available'),
('A-103','A',1,3,0,'triple','available'),
('A-104','A',1,1,1,'single','occupied'),
('A-201','A',2,3,3,'triple','occupied'),
('A-202','A',2,3,1,'triple','available'),
('A-203','A',2,2,'double','available',0),
('B-101','B',1,3,3,'triple','occupied'),
('B-102','B',1,3,2,'triple','available'),
('B-103','B',1,3,0,'triple','maintenance'),
('C-101','C',1,3,3,'triple','occupied'),
('C-102','C',1,3,1,'triple','available'),
('C-201','C',2,3,2,'triple','available'),
('D-101','D',1,3,3,'triple','occupied'),
('D-102','D',1,3,0,'triple','reserved');

-- Fix bad insert above
DELETE FROM rooms WHERE room_number='A-203';
INSERT IGNORE INTO rooms (room_number, block, floor, capacity, occupied, room_type, status) VALUES
('A-203','A',2,2,0,'double','available');
