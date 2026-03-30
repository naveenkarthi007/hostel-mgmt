-- ============================================================
--  Bannari Amman Institute of Technology
--  Hostel Management System – Complete Database Schema
--  Compatible with MySQL 5.7+ / 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS hostel_mgmt
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hostel_mgmt;

-- ── USERS TABLE (Authentication for Admin, Caretaker, Warden, Student) ──
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  password    VARCHAR(255) NULL,
  google_id   VARCHAR(255) DEFAULT NULL,
  role        ENUM('admin','caretaker','warden','student') DEFAULT 'student',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ROOMS TABLE (Hostel Room Information) ──
CREATE TABLE IF NOT EXISTS rooms (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  room_number  VARCHAR(20) NOT NULL UNIQUE,
  block        ENUM('A','B','C','D') NOT NULL,
  floor        TINYINT NOT NULL DEFAULT 1,
  capacity     TINYINT NOT NULL DEFAULT 3,
  occupied     TINYINT NOT NULL DEFAULT 0,
  room_type    ENUM('single','double','triple') DEFAULT 'triple',
  status       ENUM('available','occupied','maintenance','reserved') DEFAULT 'available',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rooms_block (block),
  INDEX idx_rooms_status (status),
  INDEX idx_rooms_room_number (room_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── STUDENTS TABLE (Student Records) ──
CREATE TABLE IF NOT EXISTS students (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT DEFAULT NULL,
  name         VARCHAR(120) NOT NULL,
  register_no  VARCHAR(30) NOT NULL UNIQUE,
  department   VARCHAR(60) NOT NULL,
  year         TINYINT NOT NULL,
  phone        VARCHAR(15),
  email        VARCHAR(120),
  address      TEXT,
  room_id      INT DEFAULT NULL,
  joined_date  DATE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
  CONSTRAINT chk_year CHECK (year BETWEEN 1 AND 4),
  INDEX idx_students_register_no (register_no),
  INDEX idx_students_email (email),
  INDEX idx_students_room_id (room_id),
  INDEX idx_students_user_id (user_id),
  INDEX idx_students_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ALLOCATIONS TABLE (Room Allocation History) ──
CREATE TABLE IF NOT EXISTS allocations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL,
  room_id      INT NOT NULL,
  allocated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  vacated_at   DATETIME DEFAULT NULL,
  is_active    TINYINT(1) DEFAULT 1,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_alloc_student_id (student_id),
  INDEX idx_alloc_room_id (room_id),
  INDEX idx_alloc_is_active (is_active),
  INDEX idx_alloc_allocated_at (allocated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── COMPLAINTS TABLE (Student Complaints & Maintenance Requests) ──
CREATE TABLE IF NOT EXISTS complaints (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT DEFAULT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  category     ENUM('plumbing','electrical','carpentry','housekeeping','network','mess','other') DEFAULT 'other',
  status       ENUM('pending','in_progress','resolved') DEFAULT 'pending',
  priority     ENUM('low','medium','high') DEFAULT 'medium',
  assigned_to  INT DEFAULT NULL,
  admin_note   TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_comp_student_id (student_id),
  INDEX idx_comp_status (status),
  INDEX idx_comp_category (category),
  INDEX idx_comp_priority (priority),
  INDEX idx_comp_assigned_to (assigned_to),
  INDEX idx_comp_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── NOTICES TABLE (Announcements & Hostel Notices) ──
CREATE TABLE IF NOT EXISTS notices (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  content     TEXT,
  category    ENUM('general','urgent','maintenance','accounts','events') DEFAULT 'general',
  target      ENUM('all','block_a','block_b','block_c','block_d') DEFAULT 'all',
  posted_by   INT DEFAULT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_notices_category (category),
  INDEX idx_notices_target (target),
  INDEX idx_notices_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── VISITORS TABLE (Guest Management) ──
CREATE TABLE IF NOT EXISTS visitors (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  visitor_name VARCHAR(120) NOT NULL,
  relation     VARCHAR(50),
  phone        VARCHAR(15),
  id_proof     VARCHAR(50),
  student_id   INT DEFAULT NULL,
  in_time      DATETIME DEFAULT CURRENT_TIMESTAMP,
  out_time     DATETIME DEFAULT NULL,
  status       ENUM('inside','exited') DEFAULT 'inside',
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  INDEX idx_visitors_student_id (student_id),
  INDEX idx_visitors_status (status),
  INDEX idx_visitors_in_time (in_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── LEAVES TABLE (Outpass / Leave Requests) ──
CREATE TABLE IF NOT EXISTS leaves (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL,
  from_date    DATE NOT NULL,
  to_date      DATE NOT NULL,
  reason       TEXT NOT NULL,
  status       ENUM('pending','approved','rejected') DEFAULT 'pending',
  approved_by  INT DEFAULT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_leaves_student_id (student_id),
  INDEX idx_leaves_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── MESS MENU TABLE ──
CREATE TABLE IF NOT EXISTS mess_menu (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week  ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  meal_type    ENUM('Breakfast','Lunch','Snacks','Dinner') NOT NULL,
  items        TEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_meal (day_of_week, meal_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default Admin User (Password: Admin@1234)
-- Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT IGNORE INTO users (name, email, password, role)
VALUES ('Chief Warden', 'admin@baithotel.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Default Warden User (Password: Warden@123)
-- Hash: $2a$10$g71PM9i4HOCI2ibO7/daOO4IinWOMCF/zuVJ/nGL/h.iPyG70he5C
INSERT IGNORE INTO users (name, email, password, role)
VALUES ('Head Warden', 'warden@baithotel.edu', '$2a$10$g71PM9i4HOCI2ibO7/daOO4IinWOMCF/zuVJ/nGL/h.iPyG70he5C', 'warden');

-- Sample Rooms (Block A)
INSERT IGNORE INTO rooms (room_number, block, floor, capacity, occupied, room_type, status) VALUES
('A-101', 'A', 1, 3, 3, 'triple', 'occupied'),
('A-102', 'A', 1, 3, 2, 'triple', 'available'),
('A-103', 'A', 1, 3, 0, 'triple', 'available'),
('A-104', 'A', 1, 1, 1, 'single', 'occupied'),
('A-201', 'A', 2, 3, 3, 'triple', 'occupied'),
('A-202', 'A', 2, 3, 1, 'triple', 'available'),
('A-203', 'A', 2, 2, 0, 'double', 'available'),
('A-301', 'A', 3, 3, 2, 'triple', 'available'),
('A-302', 'A', 3, 3, 0, 'triple', 'maintenance');

-- Sample Rooms (Block B)
INSERT IGNORE INTO rooms (room_number, block, floor, capacity, occupied, room_type, status) VALUES
('B-101', 'B', 1, 3, 3, 'triple', 'occupied'),
('B-102', 'B', 1, 3, 2, 'triple', 'available'),
('B-103', 'B', 1, 3, 0, 'triple', 'maintenance'),
('B-104', 'B', 1, 2, 1, 'double', 'available'),
('B-201', 'B', 2, 3, 3, 'triple', 'occupied'),
('B-202', 'B', 2, 3, 2, 'triple', 'available'),
('B-203', 'B', 2, 2, 0, 'double', 'available');

-- Sample Rooms (Block C)
INSERT IGNORE INTO rooms (room_number, block, floor, capacity, occupied, room_type, status) VALUES
('C-101', 'C', 1, 3, 3, 'triple', 'occupied'),
('C-102', 'C', 1, 3, 1, 'triple', 'available'),
('C-103', 'C', 1, 3, 0, 'triple', 'available'),
('C-201', 'C', 2, 3, 2, 'triple', 'available'),
('C-202', 'C', 2, 2, 0, 'double', 'reserved'),
('C-203', 'C', 2, 1, 0, 'single', 'available');

-- Sample Rooms (Block D)
INSERT IGNORE INTO rooms (room_number, block, floor, capacity, occupied, room_type, status) VALUES
('D-101', 'D', 1, 3, 3, 'triple', 'occupied'),
('D-102', 'D', 1, 3, 0, 'triple', 'reserved'),
('D-103', 'D', 1, 3, 1, 'triple', 'available'),
('D-201', 'D', 2, 3, 2, 'triple', 'available'),
('D-202', 'D', 2, 2, 1, 'double', 'available'),
('D-203', 'D', 2, 1, 1, 'single', 'occupied');

-- Sample Student Data
INSERT IGNORE INTO students
(name, register_no, department, year, phone, email, joined_date) VALUES
('Rajesh Kumar', 'BIT21CS001', 'CSE', 1, '9876543210', 'rajesh@student.edu', '2023-06-15'),
('Priya Singh', 'BIT21CS002', 'CSE', 1, '9876543211', 'priya@student.edu', '2023-06-15'),
('Amit Patel', 'BIT21ECE001', 'ECE', 2, '9876543212', 'amit@student.edu', '2022-06-15'),
('Neha Sharma', 'BIT21EEE001', 'EEE', 2, '9876543213', 'neha@student.edu', '2022-06-15'),
('Vikram Nair', 'BIT21MECH001', 'MECH', 3, '9876543214', 'vikram@student.edu', '2021-06-15'),
('Anjali Roy', 'BIT21CIVIL001', 'CIVIL', 3, '9876543215', 'anjali@student.edu', '2021-06-15'),
('Rohan Gupta', 'BIT21IT001', 'IT', 4, '9876543216', 'rohan@student.edu', '2020-06-15'),
('Divya Menon', 'BIT21AIDS001', 'AIDS', 4, '9876543217', 'divya@student.edu', '2020-06-15'),
('Sanjay Desai', 'BIT22CS001', 'CSE', 1, '9876543218', 'sanjay@student.edu', '2023-06-15'),
('Kavya Pillai', 'BIT22ECE002', 'ECE', 1, '9876543219', 'kavya@student.edu', '2023-06-15');

-- Sample Allocations (link students to rooms)
INSERT IGNORE INTO allocations (student_id, room_id, is_active) VALUES
(1, 1, 1),
(2, 1, 1),
(3, 8, 1),
(4, 8, 1),
(5, 14, 1),
(6, 15, 1),
(7, 20, 1),
(8, 25, 1);

-- Sample Complaints
INSERT IGNORE INTO complaints
(student_id, title, description, category, status, priority) VALUES
(1, 'Leaking Tap in Bathroom', 'Water leaking from the tap in the bathroom', 'plumbing', 'pending', 'high'),
(2, 'Electrical Short Circuit', 'Light switch not working properly', 'electrical', 'in_progress', 'medium'),
(3, 'Door Lock Repair', 'Room door lock is broken', 'carpentry', 'pending', 'medium'),
(4, 'Dirty Corridor', 'Common area not cleaned for days', 'housekeeping', 'pending', 'low'),
(5, 'WiFi Connection Issue', 'Internet not working in the room', 'network', 'in_progress', 'medium'),
(6, 'Mess Food Quality', 'Quality of food has deteriorated', 'mess', 'pending', 'low'),
(7, 'Broken Window Pane', 'Window glass is cracked', 'carpentry', 'resolved', 'medium'),
(8, 'Water Blockage', 'Drainage system not working', 'plumbing', 'in_progress', 'high');

-- Sample Notices
INSERT IGNORE INTO notices
(title, content, category, target, posted_by) VALUES
('Hostel Maintenance Schedule', 'Maintenance work will be conducted in Block C from 2-5 PM on Saturday', 'maintenance', 'all', 1),
('Accounts Office Schedule', 'Accounts office will remain open from 10 AM to 4 PM on working days', 'accounts', 'all', 1),
('Special Event Announcement', 'Annual Hostel Fest to be held on 3rd Saturday of the month', 'events', 'all', 1),
('Internet Upgrade', 'WiFi speed upgrade in progress. Expect some downtime', 'urgent', 'all', 1),
('Block A Water Supply', 'Water supply will be interrupted in Block A for 2 hours on Wednesday', 'maintenance', 'block_a', 1);

-- Visitor Sample Data
INSERT IGNORE INTO visitors
(visitor_name, relation, phone, student_id, status) VALUES
('Mrs. Rajesh Mother', 'Mother', '9123456789', 1, 'exited'),
('Mr. Singh Father', 'Father', '9234567890', 2, 'inside'),
('Sister Priya', 'Sister', '9345678901', 3, 'inside');

-- ============================================================
-- ADDITIONAL PERFORMANCE INDEXES
-- (Using CREATE INDEX IF NOT EXISTS syntax for MySQL 8.0.29+)
-- For older MySQL versions, these will error if indexes already exist
-- ============================================================

CREATE INDEX idx_students_created_at ON students(created_at);
CREATE INDEX idx_comp_updated_at ON complaints(updated_at);
CREATE INDEX idx_rooms_block_status ON rooms(block, status);
CREATE INDEX idx_alloc_student_room ON allocations(student_id, room_id);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
