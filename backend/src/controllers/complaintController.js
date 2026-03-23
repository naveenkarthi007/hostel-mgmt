const { pool } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const { status, category, priority, page=1, limit=20 } = req.query;
    let where = '1=1'; const params = [];
    if (status)   { where += ' AND c.status=?';   params.push(status); }
    if (category) { where += ' AND c.category=?'; params.push(category); }
    if (priority) { where += ' AND c.priority=?'; params.push(priority); }
    const offset = (parseInt(page)-1)*parseInt(limit);
    const [rows] = await pool.query(
      `SELECT c.*,s.name as student_name,s.register_no,r.room_number FROM complaints c
       LEFT JOIN students s ON c.student_id=s.id
       LEFT JOIN rooms r ON s.room_id=r.id
       WHERE ${where} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
      [...params,parseInt(limit),offset]
    );
    const [[{total}]] = await pool.query(`SELECT COUNT(*) as total FROM complaints c WHERE ${where}`, params);
    res.json({ success: true, data: rows, total, page: parseInt(page) });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error.' }); }
};

const create = async (req, res) => {
  const { student_id, title, description, category, priority } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title required.' });
  try {
    const [result] = await pool.query(
      'INSERT INTO complaints (student_id,title,description,category,priority) VALUES (?,?,?,?,?)',
      [student_id||null,title,description,category||'other',priority||'medium']
    );
    res.status(201).json({ success: true, message: 'Complaint filed.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error.' }); }
};

const updateStatus = async (req, res) => {
  const { status, admin_note } = req.body;
  if (!['pending','in_progress','resolved'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  try {
    await pool.query('UPDATE complaints SET status=?,admin_note=? WHERE id=?', [status,admin_note,req.params.id]);
    res.json({ success: true, message: 'Complaint updated.' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error.' }); }
};

const remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM complaints WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Complaint deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error.' }); }
};

module.exports = { getAll, create, updateStatus, remove };
