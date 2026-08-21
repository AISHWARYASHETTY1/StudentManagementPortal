# ✈️ PRE-FLIGHT CHECKLIST - Before You Start

## 📋 Code Changes Verification

### Backend Files

#### File 1: attendanceController.js
**Location:** `server/controllers/attendanceController.js`

**Verify these functions exist:**
```javascript
// Function 1: getStudentsByCourse
async function getStudentsByCourse(req, res) {
  const courseId = req.query.courseId;
  // Returns students enrolled in course
}

// Function 2: bulkMarkAttendance
async function bulkMarkAttendance(req, res) {
  const { courseId, attendanceRecords } = req.body;
  // Marks attendance for multiple students
}

// Verify exports
module.exports = {
  getAllAttendance,
  addAttendance,
  getAttendance,
  getStudentsByCourse,      // ✅ NEW
  bulkMarkAttendance        // ✅ NEW
};
```

**Status:** ✅ or ❌

---

#### File 2: attendanceRoutes.js
**Location:** `server/routes/attendanceRoutes.js`

**Verify these routes exist:**
```javascript
// Route 1: Get students by course
router.get("/course/students", getStudentsByCourse);

// Route 2: Bulk mark attendance
router.post("/bulk-mark", bulkMarkAttendance);
```

**Verify imports:**
```javascript
const { 
  getAllAttendance, 
  addAttendance, 
  getAttendance,
  getStudentsByCourse,      // ✅ NEW
  bulkMarkAttendance        // ✅ NEW
} = require("../controllers/attendanceController");
```

**Status:** ✅ or ❌

---

### Frontend Files

#### File 3: Attendance.jsx
**Location:** `admin-client/src/pages/Attendance.jsx`

**Verify file size:**
- Old file: ~200-300 lines
- New file: 700+ lines (complete rewrite)

**Verify these features exist:**
```javascript
// 1. State variables
const [selectedCourse, setSelectedCourse] = useState(null);
const [students, setStudents] = useState([]);
const [attendanceData, setAttendanceData] = useState({});

// 2. Functions
const fetchCourses = async () => { ... };
const fetchStudentsByCourse = async (courseId) => { ... };
const handleCourseChange = (e) => { ... };
const handleStatusChange = (studentId, status) => { ... };
const handleBulkSubmit = async (e) => { ... };

// 3. Render elements
- Dropdown for course selection
- Table with student list
- Radio buttons for status
- Quick action buttons
- Submit button
- History tab
```

**Status:** ✅ or ❌

---

## 🔧 Configuration Checks

### Database Connection
**File:** `server/config/db.js`

```javascript
// Verify connection settings
Server: 172.16.39.18
Port: 1433
Database: StudentPortalDB
User: sa
```

**Test connection:**
```bash
# In terminal, inside server folder
node -e "const db = require('./config/db'); db.connectDB();"
# Should print: Connected to database
```

**Status:** ✅ or ❌

---

### Package.json Files

#### Backend packages
**File:** `server/package.json`

**Required packages:**
- express (✅ Should have)
- mssql (✅ Should have)
- cors (✅ Should have)
- jsonwebtoken (✅ Should have)

```bash
# Check installed
cd server && npm list | grep -E "express|mssql|cors|jsonwebtoken"
```

**Status:** ✅ or ❌

---

#### Frontend packages
**File:** `admin-client/package.json`

**Required packages:**
- react (✅ Should have)
- react-router-dom (✅ Should have)
- axios (✅ Should have)
- recharts (✅ Should have)

```bash
# Check installed
cd admin-client && npm list | grep -E "react|axios|recharts"
```

**Status:** ✅ or ❌

---

## 🚀 Environment Setup

### Port Configuration
- ✅ Backend Port: 5000 (server/app.js)
- ✅ Frontend Port: 5173 (admin-client/vite.config.js)
- ✅ Database Port: 1433

**Status:** ✅ or ❌

---

### API Base URLs

**Backend (server/app.js):**
```javascript
// Should have these routes mounted
app.use('/api/attendance', attendanceRoutes);  // ✅ Must exist
```

**Frontend (admin-client/src/pages/Attendance.jsx):**
```javascript
// Should call these endpoints
const coursesResponse = await fetch('http://localhost:5000/api/courses');
const studentsResponse = await fetch(`http://localhost:5000/api/attendance/course/students?courseId=${courseId}`);
const submitResponse = await fetch('http://localhost:5000/api/attendance/bulk-mark', {...});
```

**Status:** ✅ or ❌

---

## 📱 Browser & Network

### CORS Configuration
**File:** `server/app.js`

```javascript
// Verify CORS is enabled
const cors = require('cors');
app.use(cors());

// OR
app.use(cors({
  origin: 'http://localhost:5173',  // ✅ Frontend URL
  credentials: true
}));
```

**Status:** ✅ or ❌

---

### Browser Setup
- ✅ Browser with DevTools (Chrome, Firefox, Safari, Edge)
- ✅ Network tab available
- ✅ Console available
- ✅ Cookies/localStorage enabled

**Status:** ✅ or ❌

---

## 🗄️ Database Setup

### Required Tables
**Run this query:**
```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo'
```

**Should return (at least):**
- [ ] Students
- [ ] StudentUsers
- [ ] StudentCourses
- [ ] Courses
- [ ] Attendance
- [ ] Marks
- [ ] Admins
- [ ] Examinations
- [ ] Timetable
- [ ] Fees
- [ ] Payments

**Status:** ✅ or ❌

---

### Required Table Columns
**Attendance table structure:**
```sql
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Attendance'
```

**Should have:**
- AttendanceId (int, PK)
- StudentId (int, FK)
- CourseId (int, FK)
- AttendanceDate (datetime)
- Status (varchar) - "Present", "Absent", "Late"

**Status:** ✅ or ❌

---

## 📊 Test Data

### Sample Course Data
```sql
-- Check if courses exist
SELECT * FROM Courses LIMIT 5

-- Should return at least 1 course
```

**Status:** ✅ or ❌

---

### Sample Student Enrollments
```sql
-- Check if students are enrolled in courses
SELECT * FROM StudentCourses LIMIT 10

-- Should return at least a few records
```

**Status:** ✅ or ❌

---

### Sample Student Data
```sql
-- Check if students exist
SELECT * FROM Students LIMIT 5

-- Should return at least 1 student
```

**Status:** ✅ or ❌

---

## 🔐 Authentication

### Admin User
```sql
-- Check if admin exists
SELECT * FROM Admins LIMIT 1

-- Should return at least 1 admin
```

**Credentials needed for login:**
- Username: (your admin username)
- Password: (your admin password)

**Status:** ✅ or ❌

---

### JWT Configuration
**File:** `server/middleware/authMiddleware.js`

```javascript
// Verify JWT secret exists
const SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Should authenticate tokens correctly
```

**Status:** ✅ or ❌

---

## 📂 File Structure Verification

### Backend Structure
```
server/
├── app.js                      (✅ Main app)
├── package.json               (✅ Dependencies)
├── config/
│   └── db.js                 (✅ Database config)
├── controllers/
│   ├── attendanceController.js    (✅ MODIFIED - Check!)
│   ├── authController.js
│   └── ...
├── middleware/
│   └── authMiddleware.js      (✅ Auth)
└── routes/
    ├── attendanceRoutes.js        (✅ MODIFIED - Check!)
    ├── authRoutes.js
    └── ...
```

**Status:** ✅ or ❌

---

### Frontend Structure
```
admin-client/
├── package.json              (✅ Dependencies)
├── vite.config.js            (✅ Vite config)
├── index.html                (✅ Entry)
└── src/
    ├── main.jsx              (✅ Entry point)
    ├── App.jsx               (✅ Root component)
    └── pages/
        └── Attendance.jsx        (✅ MODIFIED - Check!)
```

**Status:** ✅ or ❌

---

## ✅ Pre-Flight Checklist

### Code Changes
- [ ] attendanceController.js has new functions
- [ ] attendanceRoutes.js has new routes
- [ ] Attendance.jsx completely redesigned (700+ lines)
- [ ] All imports are correct
- [ ] No syntax errors visible

### Configuration
- [ ] Database connection configured
- [ ] Backend port: 5000
- [ ] Frontend port: 5173
- [ ] CORS enabled
- [ ] Package dependencies installed

### Database
- [ ] Database connection working
- [ ] All required tables exist
- [ ] Sample data available
- [ ] Admin user exists

### Dependencies
- [ ] Backend npm packages installed
- [ ] Frontend npm packages installed
- [ ] No version conflicts
- [ ] All imports work

### Authentication
- [ ] JWT secret configured
- [ ] Admin credentials available
- [ ] Student credentials available
- [ ] Token validation working

### Environment
- [ ] Browser DevTools available
- [ ] Network tab can capture requests
- [ ] Console can show logs
- [ ] LocalStorage enabled

---

## 🚦 Ready to Start?

### If ALL checkboxes are ✅
**You're ready!**
```bash
# Terminal 1: Start backend
cd server && npm start

# Terminal 2: Start frontend
cd admin-client && npm start

# Terminal 3: Test endpoints
curl http://localhost:5000/api/attendance/course/students?courseId=1
```

### If ANY checkbox is ❌
**Not ready yet!**
1. Identify which item is not checked
2. Go to that section
3. Fix the issue
4. Come back and verify
5. Once all ✅, proceed

---

## 🆘 Troubleshooting Pre-Flight

### "Backend won't start"
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# If in use, either:
# 1. Stop the process using port 5000
# 2. Change port in server/app.js
```

### "Frontend won't start"
```bash
# Check if npm installed dependencies
cd admin-client && npm install

# Check for node_modules
dir node_modules | head
```

### "Database connection fails"
```bash
# Test connection
sqlcmd -S 172.16.39.18,1433 -U sa -P your_password -Q "SELECT DB_NAME()"

# If fails:
# 1. Check server address
# 2. Check port 1433 is open
# 3. Check credentials
# 4. Check database exists
```

### "Cannot import modules"
```bash
# Reinstall dependencies
cd server && npm install
cd ../admin-client && npm install

# Clear cache if needed
npm cache clean --force
```

---

## 🎯 Next Step

Once ALL checklist items are ✅:

**Read:** IMPLEMENTATION_GUIDE.md
**Follow:** Step-by-step testing procedures
**Verify:** Everything works as expected
**Celebrate:** Success! 🎉

---

## 📞 Support

If stuck on any item:
1. Read the detailed section above for that item
2. Check IMPLEMENTATION_GUIDE.md for help
3. Review VERIFICATION_CHECKLIST.md
4. Check backend terminal logs
5. Check browser console (F12)

---

**You've got this! Let's get started!** 🚀
