const { pool } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    let where = '1=1';
    const params = [];

    if (search) {
      where += ' AND (v.visitor_name LIKE ? OR v.phone LIKE ? OR s.name LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q);
    }
    if (status) {
      where += ' AND v.status = ?';
      params.push(status);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch visitors with student details
    const [rows] = await pool.query(
      `SELECT v.*, s.name as student_name, s.register_no as student_reg, r.room_number 
       FROM visitors v 
       LEFT JOIN students s ON v.student_id = s.id
       LEFT JOIN rooms r ON s.room_id = r.id
       WHERE ${where} 
       ORDER BY v.in_time DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM visitors v
       LEFT JOIN students s ON v.student_id = s.id
       WHERE ${where}`, 
      params
    );

    res.json({
      success: true,
      data: rows,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Get Visitors Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving visitors.' });
  }
};

const create = async (req, res) => {
  const { visitor_name, relation, phone, id_proof, student_id } = req.body;
  
  if (!visitor_name || !relation || !phone || !student_id) {
    return res.status(400).json({ success: false, message: 'Visitor name, relation, phone, and student are required.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO visitors (visitor_name, relation, phone, id_proof, student_id, in_time, status) 
       VALUES (?, ?, ?, ?, ?, NOW(), 'inside')`,
      [visitor_name, relation, phone, id_proof, student_id]
    );

    res.status(201).json({ success: true, message: 'Visitor logged successfully.', id: result.insertId });
  } catch (err) {
    console.error('Create Visitor Error:', err);
    res.status(500).json({ success: false, message: 'Server error logging visitor.' });
  }
};

const markExit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      `UPDATE visitors SET status = 'exited', out_time = NOW() WHERE id = ? AND status = 'inside'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Visitor not found or already exited.' });
    }

    res.json({ success: true, message: 'Visitor marked as exited.' });
  } catch (err) {
    console.error('Mark Exit Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating visitor status.' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM visitors WHERE id = ?', [id]);
    res.json({ success: true, message: 'Visitor record deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, create, markExit, remove };
