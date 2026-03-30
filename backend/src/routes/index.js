const express = require('express');
const router = express.Router();
const { authenticate, adminOnly, caretakerOrAdmin, wardenOrAdmin } = require('../middleware/auth');

const authCtrl       = require('../controllers/authController');
const dashCtrl       = require('../controllers/dashboardController');
const studentCtrl    = require('../controllers/studentController');
const roomCtrl       = require('../controllers/roomController');
const allocCtrl      = require('../controllers/allocationController');
const complaintCtrl  = require('../controllers/complaintController');
const noticeCtrl     = require('../controllers/noticeController');
const studentPortal  = require('../controllers/studentPortalController');
const bulkCtrl       = require('../controllers/bulkController');
const caretakerCtrl  = require('../controllers/caretakerController');
const wardenCtrl     = require('../controllers/wardenController');
const visitorCtrl    = require('../controllers/visitorController');
const leaveCtrl      = require('../controllers/leaveController');
const messCtrl       = require('../controllers/messMenuController');
const multer         = require('multer');

const upload = multer({ dest: 'uploads/' });
// ── Auth ──────────────────────────────────────────────────
router.post('/auth/login',           authCtrl.login);
router.post('/auth/google',          authCtrl.googleLogin);
router.get ('/auth/me',              authenticate, authCtrl.me);
router.put ('/auth/change-password', authenticate, authCtrl.changePassword);

// ── Dashboard (Admin) ─────────────────────────────────────
router.get('/dashboard', authenticate, adminOnly, dashCtrl.getStats);

// ── Caretaker Dashboard ───────────────────────────────────
router.get('/caretaker/dashboard', authenticate, caretakerOrAdmin, caretakerCtrl.getStats);
router.get('/caretaker/complaints', authenticate, caretakerOrAdmin, caretakerCtrl.getComplaints);
router.put('/caretaker/complaints/:id', authenticate, caretakerOrAdmin, caretakerCtrl.updateComplaintStatus);

// ── Warden Dashboard ──────────────────────────────────────
router.get('/warden/dashboard', authenticate, wardenOrAdmin, wardenCtrl.getStats);
router.get('/warden/students', authenticate, wardenOrAdmin, wardenCtrl.getStudents);
router.get('/warden/complaints', authenticate, wardenOrAdmin, wardenCtrl.getComplaints);

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

// ── Visitors (Admin / Warden) ────────────────────────────
router.get   ('/visitors',            authenticate, wardenOrAdmin, visitorCtrl.getAll);
router.post  ('/visitors',            authenticate, wardenOrAdmin, visitorCtrl.create);
router.put   ('/visitors/:id/exit',   authenticate, wardenOrAdmin, visitorCtrl.markExit);
router.delete('/visitors/:id',        authenticate, adminOnly, visitorCtrl.remove);

// ── Leaves / Outpasses (Admin / Warden / Student) ────────
router.get   ('/leaves',              authenticate, leaveCtrl.getAll);
router.post  ('/leaves',              authenticate, leaveCtrl.create);
router.put   ('/leaves/:id/status',   authenticate, wardenOrAdmin, leaveCtrl.updateStatus);
router.delete('/leaves/:id',          authenticate, leaveCtrl.remove);

// ── Mess Menu (Admin / Student / Warden) ─────────────────
router.get   ('/mess-menu',           authenticate, messCtrl.getAll);
router.put   ('/mess-menu',           authenticate, wardenOrAdmin, messCtrl.update);

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
