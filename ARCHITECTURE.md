# System Architecture After Updates

## 🔐 Authentication & Authorization Flow

```
User Login
    ↓
JWT Token Created with Role
    ↓
┌───────────────────────────────────────────────┐
│  Role: 'admin'           → Admin Dashboard     │
│  Role: 'student'         → Student Portal      │
│  Role: 'caretaker'       → Complaint Mgmt      │
│  Role: 'warden'          → Student Oversight   │
└───────────────────────────────────────────────┘
```

## 📊 Middleware Stack (Backend)

```
Request → authenticate() → Check JWT Token
                              ↓
                         Token Valid?
                         ├─ YES → Add req.user
                         └─ NO  → 401 Unauthorized
                              ↓
                         Role Check Middleware
                    ├─ adminOnly()         → Admin routes
                    ├─ caretakerOrAdmin()  → Caretaker + Admin
                    ├─ wardenOrAdmin()     → Warden + Admin
                    └─ roleCheck([roles])  → Custom roles
                              ↓
                         Controller → Response
```

## 🎯 API Endpoints by Role

```
┌─────────────────────────────────────────────────────────────┐
│                         ADMIN                               │
├─────────────────────────────────────────────────────────────┤
│  /dashboard               - Full system stats              │
│  /students/*              - All student management         │
│  /rooms/*                 - All room management            │
│  /allocations/*           - All allocations               │
│  /complaints/*            - All complaints (admin view)   │
│  /notices/*               - All notice management         │
│  /bulk/*                  - Bulk operations               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      CARETAKER                              │
├─────────────────────────────────────────────────────────────┤
│  /caretaker/dashboard     - Complaint stats               │
│  /caretaker/complaints    - View/manage all complaints   │
│  /caretaker/complaints/:id - Update complaint status    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       WARDEN                                │
├─────────────────────────────────────────────────────────────┤
│  /warden/dashboard        - Rooms, fees, complaints      │
│  /warden/students         - List & search students       │
│  /warden/complaints       - View complaints              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      STUDENT                                │
├─────────────────────────────────────────────────────────────┤
│  /student/profile         - View own profile              │
│  /student/dashboard       - Personal dashboard            │
│  /student/complaints      - View own complaints           │
│  /student/complaints      - File new complaint            │
│  /student/notices         - View notices                  │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Frontend Component Structure

```
App.jsx
├── LoginPage.jsx (No role handling needed)
├── AdminLayout
│   ├── DashboardPage.jsx
│   ├── StudentsPage.jsx
│   ├── RoomsPage.jsx
│   ├── AllocationsPage.jsx
│   ├── ComplaintsPage.jsx
│   └── NoticesPage.jsx
│
└── StudentLayout
    ├── student/
    │   ├── StudentDashboard.jsx ✨ REDESIGNED
    │   ├── StudentProfile.jsx ✨ REDESIGNED
    │   ├── StudentComplaints.jsx
    │   └── StudentNotices.jsx
```

## 🔄 Data Flow Example: Complaint Management

```
STUDENT (File Complaint)
    ↓
POST /student/complaints
    ↓
studentPortalController.fileComplaint()
    ├─ Validate: Student profile exists
    ├─ Create: New complaint record
    └─ Response: Complaint ID

CARETAKER (Manage Complaints)
    ↓
GET /caretaker/complaints
    ↓
caretakerController.getComplaints()
    ├─ FetchAll: Complaints with filters
    ├─ Join: Student + Room info
    └─ Response: Complaint list

PUT /caretaker/complaints/:id
    ↓
caretakerController.updateComplaintStatus()
    ├─ Validate: Complaint exists
    ├─ Update: Status + assigned_to
    └─ Response: Success message

WARDEN (Overview)
    ↓
GET /warden/complaints
    ↓
wardenController.getComplaints()
    ├─ FetchAll: All complaints
    ├─ Join: Full student + room details
    └─ Response: Complaint list
```

## 🎨 UI Changes Summary

### Before → After

```
STUDENT DASHBOARD:
Before: Simple cards with basic styling
After:  Gradient background, animations, progress bars, icons

STUDENT PROFILE:
Before: Single card with grid layout
After:  Hero banner, icon-based fields, status dashboard, better spacing
```

## 📦 New Files Added

```
Backend:
├── controllers/caretakerController.js   (Complaint management)
└── controllers/wardenController.js      (Student oversight)

Frontend:
└── (Updated existing files, no new pages)
```

## 🔗 Database Requirements

Ensure the `users` table has:
```sql
ALTER TABLE users ADD COLUMN role ENUM('admin', 'student', 'caretaker', 'warden') DEFAULT 'student';
```

## 🚀 Scaling the Role System

To add a new role (e.g., 'supervisor'):

1. **Backend**:
   ```javascript
   // In middleware/auth.js
   const supervisorOrAdmin = (req, res, next) => {
     if (!['admin', 'supervisor'].includes(req.user.role)) {
       return res.status(403).json({ success: false, message: 'Supervisor or Admin access required.' });
     }
     next();
   };
   ```

2. **Create Controller**:
   ```javascript
   // controllers/supervisorController.js
   // Implement role-specific logic
   ```

3. **Add Routes**:
   ```javascript
   // routes/index.js
   router.get('/supervisor/dashboard', authenticate, supervisorOrAdmin, supervisorCtrl.getStats);
   ```

4. **Frontend API**:
   ```javascript
   export const supervisorAPI = {
     getStats: () => api.get('/supervisor/dashboard'),
   };
   ```

---

## ✅ Current Status

- ✅ Multi-role authentication framework
- ✅ Modern frontend UI/UX
- ✅ Scalable role system
- ✅ Clear separation of concerns
- ✅ Backward compatible

