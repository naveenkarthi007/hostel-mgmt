const fs = require('fs');
const csv = require('csv-parser');
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

exports.bulkStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const rows = await parseCSV(req.file.path);
    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    // Delete file after reading
    fs.unlinkSync(req.file.path);

    // Process rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      try {
        const { name, register_no, department, phone, email, year } = row;
        
        if (!name || !register_no || !email) {
          throw new Error('Name, register_no, and email are required');
        }

        // Check duplicates
        const [existing] = await pool.query(
          'SELECT id FROM students WHERE email = ? OR register_no = ?', 
          [email, register_no]
        );

        if (existing.length > 0) {
          throw new Error('Email or register number already exists');
        }
        
        const [existingUser] = await pool.query(
          'SELECT id FROM users WHERE email = ?', 
          [email]
        );
        
        if (existingUser.length > 0) {
          throw new Error('Email is already registered as a user');
        }

        const defaultPassword = await bcrypt.hash('student123', 10);
        
        // 1. Create a user record so the student can log in
        const [userResult] = await pool.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name, email, defaultPassword, 'student']
        );
        const userId = userResult.insertId;

        // 2. Create the student record linked to the user
        await pool.query(`
          INSERT INTO students 
          (user_id, name, register_no, department, year, phone, email) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          userId, name, register_no, department || 'CSE', year || 1, phone || '', email
        ]);

        successCount++;
      } catch (err) {
        failedCount++;
        errors.push({ row: rowNum, reason: err.message });
      }
    }

    res.json({ successCount, failedCount, errors });
  } catch (error) {
    console.error('Bulk student import error:', error);
    res.status(500).json({ error: 'Server error during bulk import' });
  }
};

exports.bulkRooms = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const rows = await parseCSV(req.file.path);
      let successCount = 0;
      let failedCount = 0;
      const errors = [];
  
      fs.unlinkSync(req.file.path);
  
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 1;
  
        try {
          const { roomNumber, block, capacity, type } = row;
          
          if (!roomNumber || !block || !capacity) {
            throw new Error('roomNumber, block, and capacity are required');
          }
  
          if (parseInt(capacity) <= 0) {
            throw new Error('Capacity must be > 0');
          }
  
          const [existing] = await pool.query(
            'SELECT id FROM rooms WHERE room_number = ? AND block = ?', 
            [roomNumber, block]
          );
  
          if (existing.length > 0) {
            throw new Error('Room already exists in this block');
          }
  
          await pool.query(`
            INSERT INTO rooms (room_number, block, capacity, type, status) 
            VALUES (?, ?, ?, ?, 'available')
          `, [roomNumber, block, capacity, type || 'Non-AC']);
  
          successCount++;
        } catch (err) {
          failedCount++;
          errors.push({ row: rowNum, reason: err.message });
        }
      }
  
      res.json({ successCount, failedCount, errors });
    } catch (error) {
      console.error('Bulk room import error:', error);
      res.status(500).json({ error: 'Server error during bulk import' });
    }
  };
  
exports.bulkAllocations = async (req, res) => {
    // Add similar logic for allocations
    res.json({ successCount: 0, failedCount: 0, errors: [{ row: 1, reason: 'Pending implementation' }] });
};
