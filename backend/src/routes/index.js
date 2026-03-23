const express = require('express');
const router = express.Router();
const { authenticate, adminOnly } = require('../middleware/auth');

const authCtrl       = require('../controllers/authController');
const dashCtrl       = require('../controllers/dashboardController');
const studentCtrl    = require('../controllers/studentController');
const roomCtrl       = require('../controllers/roomController');
const allocCtrl      = require('../controllers/allocationController');
const complaintCtrl  = require('../controllers/complaintController');
const noticeCtrl     = require('../controllers/noticeController');
const studentPortal  = require('../controllers/studentPortalController');       
const bulkCtrl       = require('../controllers/bulkController');
const multer         = require('multer');

const upload = multer({ dest: 'uploads/' });
// ── Auth ──────────────────────────────────────────────────
router.post('/auth/login',           authCtrl.login);
router.post('/auth/google',          authCtrl.googleLogin);
router.get ('/auth/me',              authenticate, authCtrl.me);
router.put ('/auth/change-password', authenticate, authCtrl.changePassword);

// ── Dashboard ────────────────────────────────────────────
router.get('/dashboard', authenticate, adminOnly, dashCtrl.getStats);

// ── Students (Admin) ─────────────────────────────────────
router.get   ('/students',         authenticate, adminOnly, studentCtrl.getAll);
router.get   ('/students/export',  authenticate, adminOnly, studentCtrl.exportCSV);
router.get   ('/students/:id',     authenticate, adminOnly, studentCtrl.getOne);
router.post  ('/students',         authenticate, adminOnly, studentCtrl.create);
router.put   ('/students/:id',     authenticate, adminOnly, studentCtrl.update);
router.delete('/students/:id',     authenticate, adminOnly, studentCtrl.remove);

// ── Rooms (Admin) ────────────────────────────────────────
router.get   ('/rooms',      authenticate, adminOnly, roomCtrl.getAll);
router.get   ('/rooms/:id',  authenticate, adminOnly, roomCtrl.getOne);
router.post  ('/rooms',      authenticate, adminOnly, roomCtrl.create);
router.put   ('/rooms/:id',  authenticate, adminOnly, roomCtrl.update);
router.delete('/rooms/:id',  authenticate, adminOnly, roomCtrl.remove);

// ── Allocations (Admin) ──────────────────────────────────
router.post('/allocations/allocate', authenticate, adminOnly, allocCtrl.allocate);
router.post('/allocations/vacate',   authenticate, adminOnly, allocCtrl.vacate);
router.get ('/allocations/history',  authenticate, adminOnly, allocCtrl.history);

// ── Complaints (Admin) ───────────────────────────────────
router.get   ('/complaints',         authenticate, adminOnly, complaintCtrl.getAll);
router.post  ('/complaints',         authenticate, adminOnly, complaintCtrl.create);
router.put   ('/complaints/:id',     authenticate, adminOnly, complaintCtrl.updateStatus);
router.delete('/complaints/:id',     authenticate, adminOnly, complaintCtrl.remove);

// ── Notices ──────────────────────────────────────────────
router.get   ('/notices',     authenticate, noticeCtrl.getAll);
router.post  ('/notices',     authenticate, adminOnly, noticeCtrl.create);
router.delete('/notices/:id', authenticate, adminOnly, noticeCtrl.remove);

// ── Student Portal ───────────────────────────────────────
router.get ('/student/profile',    authenticate, studentPortal.getMyProfile);
router.get ('/student/dashboard',  authenticate, studentPortal.getMyDashboard);
router.get ('/student/complaints', authenticate, studentPortal.getMyComplaints);
router.post('/student/complaints', authenticate, studentPortal.fileComplaint);
router.put ('/student/complaints/:id', authenticate, studentPortal.updateMyComplaint);
router.patch('/student/complaints/:id/resolve', authenticate, studentPortal.resolveMyComplaint);

router.post('/bulk/students', authenticate, adminOnly, upload.single('file'), bulkCtrl.bulkStudents);
router.post('/bulk/rooms', authenticate, adminOnly, upload.single('file'), bulkCtrl.bulkRooms);
router.post('/bulk/allocations', authenticate, adminOnly, upload.single('file'), bulkCtrl.bulkAllocations);

module.exports = router;
