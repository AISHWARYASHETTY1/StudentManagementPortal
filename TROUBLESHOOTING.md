# 🔧 TROUBLESHOOTING GUIDE - Bulk Attendance Feature

## Common Issues & Solutions

---

## 🚫 Issue 1: Backend Server Won't Start

### Problem
```
Error: listen EADDRINUSE: address already in use :::5000
```

### Solutions

#### Solution A: Port Already in Use
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Output example:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    1234

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Try starting again
npm start
```

#### Solution B: Change Port
```javascript
// Edit: server/app.js
// Find: const PORT = 5000;
// Change to: const PORT = 5001;

// Also update frontend
// Edit: admin-client/src/pages/Attendance.jsx
// Find: http://localhost:5000
// Change to: http://localhost:5001
```

#### Solution C: Check Node Installation
```bash
# Verify Node is installed
node --version

# Should show v14+ or higher

# If not installed, install from nodejs.org
```

---

## 🚫 Issue 2: Frontend Won't Start

### Problem
```
Error: ENOENT: no such file or directory
```

### Solutions

#### Solution A: Dependencies Not Installed
```bash
# Navigate to frontend folder
cd admin-client

# Install all dependencies
npm install

# If still fails, try clean install
npm cache clean --force
npm install

# Start again
npm start
```

#### Solution B: Node Version Incompatible
```bash
# Check Node version
node --version

# Should be v14 or higher

# Update Node if needed
# Visit: https://nodejs.org/
```

#### Solution C: Port Already in Use
```bash
# Find what's using port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F

# Try starting again
npm start
```

---

## 🚫 Issue 3: Database Connection Fails

### Problem
```
Error: Connection pool exhausted or timeout
Error: Cannot open database
```

### Solutions

#### Solution A: Check Database Server
```bash
# Test connection to SQL Server
sqlcmd -S 172.16.39.18,1433 -U sa -P your_password

# If connection successful, prompt appears: 1>

# If fails, database server unreachable
```

#### Solution B: Verify Connection String
```javascript
// Check: server/config/db.js

const config = {
  user: 'sa',
  password: 'your_password',  // ⚠️ CHANGE THIS
  server: '172.16.39.18',
  port: 1433,
  database: 'StudentPortalDB',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'your_password'  // ⚠️ CHANGE THIS
    }
  }
};

// Make sure password is correct!
```

#### Solution C: Check Network
```bash
# Test if server is reachable
ping 172.16.39.18

# If timeout, network issue

# Test port connectivity
telnet 172.16.39.18 1433

# If refused, port closed or service down
```

#### Solution D: Check Firewall
```bash
# Database might be blocked
# Check Windows Firewall settings
# Allow port 1433 through firewall

# Or disable firewall (development only)
```

---

## 🚫 Issue 4: API Endpoint Returns 404

### Problem
```
GET http://localhost:5000/api/attendance/course/students
Response: 404 Not Found
```

### Solutions

#### Solution A: Verify Routes Registered
```javascript
// Check: server/app.js

// Should have:
app.use('/api/attendance', attendanceRoutes);

// If missing, add it:
const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);
```

#### Solution B: Verify Controller Function
```javascript
// Check: server/controllers/attendanceController.js

// Should export:
module.exports = {
  getStudentsByCourse,     // ✅ NEW
  bulkMarkAttendance,      // ✅ NEW
  // ... old functions
};
```

#### Solution C: Verify Route Definition
```javascript
// Check: server/routes/attendanceRoutes.js

// Should have:
router.get('/course/students', getStudentsByCourse);
router.post('/bulk-mark', bulkMarkAttendance);

// Make sure EXACT paths match!
```

#### Solution D: Restart Backend
```bash
# Sometimes Node caches old code

# Stop server (Ctrl+C)
# Clear require cache
npm cache clean --force

# Restart
npm start
```

---

## 🚫 Issue 5: Course Dropdown Shows No Courses

### Problem
- Dropdown loads but shows empty
- Console error: Empty array returned

### Solutions

#### Solution A: Check Sample Data
```sql
-- In SQL Server Management Studio
SELECT * FROM Courses;

-- Should return at least 1 course
-- If empty, insert sample data:

INSERT INTO Courses (CourseCode, CourseName, Credits)
VALUES ('CS101', 'Introduction to Computer Science', 3);
```

#### Solution B: Check API Response
```bash
# Test course API directly
curl http://localhost:5000/api/courses

# Should return JSON array
# If empty [], insert sample data in database

# If error, check database connection
```

#### Solution C: Check Authentication
```javascript
// If getting 401 Unauthorized

// Make sure you logged in first
// JWT token must be in localStorage

// Check browser DevTools:
// F12 → Application → LocalStorage
// Should have 'token' key
```

---

## 🚫 Issue 6: Students Not Loading After Course Selection

### Problem
- Course selected but no students appear
- Page shows loading spinner indefinitely
- Network tab shows failed request

### Solutions

#### Solution A: Check StudentCourses Data
```sql
-- Verify students are enrolled in course
SELECT * FROM StudentCourses WHERE CourseId = 1;

-- If empty, no students enrolled
-- Insert test data:

INSERT INTO StudentCourses (StudentId, CourseId, EnrollmentDate, EnrollmentStatus)
VALUES (1, 1, GETDATE(), 'Active');
```

#### Solution B: Check API Response
```bash
# Test API with actual courseId
curl "http://localhost:5000/api/attendance/course/students?courseId=1"

# Should return JSON with students array
# If error, check console logs
```

#### Solution C: Check Frontend Logs
```javascript
// F12 → Console tab
// Should show API URL being called

// If no log, function not running
// Check JavaScript errors

// If error response, check backend logs
```

#### Solution D: Wait for Load
```
Some queries take longer
- Wait 3-5 seconds
- Check network tab (F12 → Network)
- See if request completed
- If status 200, but no data, database issue
```

---

## 🚫 Issue 7: Submit Attendance Button Does Nothing

### Problem
- Click submit, nothing happens
- No loading indicator
- No error message

### Solutions

#### Solution A: Check Form Validation
```javascript
// Form might fail validation
// Check required fields:

// 1. Course must be selected
// 2. At least 1 student must be marked

// Try:
// 1. Select course
// 2. Wait for students
// 3. Click "All Present"
// 4. Now try submit
```

#### Solution B: Check Console Errors
```
F12 → Console tab

Look for red errors like:
- "Cannot read property X"
- "Invalid API response"
- "Network error"

If found, read error message carefully
```

#### Solution C: Check Network Request
```
F12 → Network tab

1. Click Submit
2. Look for POST /api/attendance/bulk-mark request
3. Check:
   - Status: Should be 200 or 201
   - Response: Check if error message
   - Time: Took how long?

If request never made, form validation failing
If request fails, backend error
```

#### Solution D: Check Backend Logs
```bash
# Terminal where backend is running
# Should show:

POST /api/attendance/bulk-mark
200 OK

# If error, backend logs show details
```

---

## 🚫 Issue 8: Attendance Submitted but Not in Database

### Problem
- Success message appeared
- But records not in database

### Solutions

#### Solution A: Check Database Directly
```sql
-- Query attendance table
SELECT * FROM Attendance 
ORDER BY AttendanceId DESC 
LIMIT 10;

-- Should show recent records

-- Filter by course
SELECT * FROM Attendance 
WHERE CourseId = 1 
ORDER BY AttendanceDate DESC;
```

#### Solution B: Verify Insert Query
```javascript
// Check: server/controllers/attendanceController.js

// bulkMarkAttendance function should have:
const result = await request
  .input('StudentId', sql.Int, record.studentId)
  .input('CourseId', sql.Int, courseId)
  .input('Status', sql.VarChar, record.status)
  .query(`INSERT INTO Attendance 
          (StudentId, CourseId, AttendanceDate, Status)
          VALUES (@StudentId, @CourseId, GETDATE(), @Status)`);

// If missing, re-implement from documentation
```

#### Solution C: Check Transaction Handling
```javascript
// Some records might fail to insert
// Check response:

{
  "success": true,
  "message": "Attendance marked for 28/30 students",
  "successRecords": 28,
  "failedRecords": 2,
  "failures": [
    {"studentId": 5, "error": "..."},
    {"studentId": 8, "error": "..."}
  ]
}

// See which students failed
// Why did they fail? Invalid StudentId? Duplicate?
```

#### Solution D: Check Student & Course IDs
```sql
-- Verify IDs exist

-- Check Students
SELECT StudentId FROM Students WHERE StudentId IN (1, 2, 3);

-- Check Courses
SELECT CourseId FROM Courses WHERE CourseId = 1;

-- Check StudentCourses
SELECT * FROM StudentCourses 
WHERE CourseId = 1 AND StudentId IN (1, 2, 3);
```

---

## 🚫 Issue 9: Student Portal Not Showing New Attendance

### Problem
- Attendance marked on admin side
- Student logs in but doesn't see new attendance
- Attendance percentage not updated

### Solutions

#### Solution A: Refresh Page
```
Sometimes client-side cache

1. Student portal → Attendance page
2. Press F5 (refresh)
3. Clear cache if needed: Ctrl+Shift+Delete
4. Reload page
```

#### Solution B: Check Student API
```bash
# Test student attendance API
curl http://localhost:5000/api/student/attendance

# Should return student's attendance records
# Check response includes newly marked records

# If not, database might have different data
```

#### Solution C: Verify Student ID
```sql
-- Check student logged in correctly
-- Verify StudentId matches

-- Query their attendance
SELECT * FROM Attendance 
WHERE StudentId = 1 
ORDER BY AttendanceDate DESC;

-- Should show newest records
```

#### Solution D: Check API Time
```javascript
// Student portal calculates attendance %

// Location: server/controllers/studentPortalController.js
// Function: getMyAttendance()

// Should query:
SELECT COUNT(*) FROM Attendance 
WHERE StudentId = @StudentId

// And calculate percentage
```

---

## 🚫 Issue 10: Color Coding Not Showing

### Problem
- Statuses show but no color
- Table rows not highlighted
- Difficult to see Present/Absent/Late

### Solutions

#### Solution A: Check CSS
```javascript
// Check: admin-client/src/pages/Attendance.jsx

// Should have inline styles:
const getRowStyle = (status) => {
  switch(status) {
    case 'Present': return { backgroundColor: '#27ae60' };  // Green
    case 'Absent': return { backgroundColor: '#e74c3c' };   // Red
    case 'Late': return { backgroundColor: '#f39c12' };     // Orange
    default: return {};
  }
};
```

#### Solution B: Check Browser DevTools
```
F12 → Inspect Element

Click on colored row

Check computed styles:
- background-color should show color
- color should be white/visible

If not showing, CSS might be overridden
```

#### Solution C: Force Refresh
```
Browser might cache old CSS

Ctrl+Shift+R (hard refresh)
Or: Ctrl+Shift+Delete (clear cache, reload)
```

---

## 🚫 Issue 11: Bulk Submit Takes Too Long

### Problem
- Clicking submit and waiting 30+ seconds
- Should be <5 seconds

### Solutions

#### Solution A: Check Network
```
F12 → Network tab

1. Click Submit
2. Watch POST request
3. Check "Time" column

Breakdown:
- Queueing: <100ms (normal)
- Stalled: Should be <1s
- DNS lookup: <100ms
- Initial connection: <500ms
- TLS setup: <1s
- Request sent: <100ms
- Waiting: <2s (backend processing)
- Content download: <1s

Total should be <5s
```

#### Solution B: Check Backend Performance
```bash
# Backend logs should show query time
# Check terminal output

# If query takes >2 seconds:
# 1. Database might be slow
# 2. Many students (>500) might slow it
# 3. Network latency

# Optimize:
# - Check database indexes
# - Reduce class size
# - Check server CPU/memory
```

#### Solution C: Check Database
```sql
-- Run query directly in SQL
SET STATISTICS TIME ON

INSERT INTO Attendance 
(StudentId, CourseId, AttendanceDate, Status)
VALUES (1, 1, GETDATE(), 'Present');

-- Check execution time shown

-- Should be <100ms per record
```

---

## 🚫 Issue 12: "All Present" Button Clicks All but Doesn't Stick

### Problem
- Click "All Present"
- Buttons show clicked momentarily
- Then revert back to unchecked

### Solutions

#### Solution A: Check State Management
```javascript
// Check: admin-client/src/pages/Attendance.jsx

// handleAllPresent function should:
const handleAllPresent = () => {
  const newData = {};
  students.forEach(student => {
    newData[student.StudentId] = 'Present';
  });
  setAttendanceData(newData);
  // Should persist after setting
};
```

#### Solution B: Check Student Array
```javascript
// If students array is empty, nothing to mark

// Make sure:
// 1. Course is selected
// 2. Wait 2-3 seconds for students to load
// 3. Check console to verify students loaded
```

#### Solution C: Debug with Console
```javascript
// Add to Attendance.jsx temporarily

console.log('Students:', students);
console.log('Attendance Data:', attendanceData);

// Refresh and check console
// Verify students array populated
// Verify attendanceData updates
```

---

## 🚫 Issue 13: "History" Tab Shows No Records

### Problem
- Tab exists but empty
- No records shown
- Might show loading spinner

### Solutions

#### Solution A: Check API
```bash
# Test history API
curl http://localhost:5000/api/attendance

# Should return all attendance records
```

#### Solution B: Check Date Range
```javascript
// History might filter by date

// Check: admin-client/src/pages/Attendance.jsx

// Look for date filtering:
// Should show records from today/this month/all time
// Adjust filter if needed
```

#### Solution C: Insert Test Data
```sql
-- If no records exist, history will be empty

-- Insert test record:
INSERT INTO Attendance (StudentId, CourseId, AttendanceDate, Status)
VALUES (1, 1, GETDATE(), 'Present');

-- Then refresh history tab
```

---

## 🚫 Issue 14: CORS Error

### Problem
```
Access to XMLHttpRequest blocked by CORS policy
Origin not allowed
```

### Solutions

#### Solution A: Enable CORS
```javascript
// Check: server/app.js

// Must have:
const cors = require('cors');
app.use(cors());

// If missing, add it BEFORE routes:
app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
// ... rest of routes
```

#### Solution B: Check Origin
```javascript
// If using specific origin:
app.use(cors({
  origin: 'http://localhost:5173',  // ✅ Must match frontend
  credentials: true
}));

// Make sure matches frontend URL exactly
```

#### Solution C: Restart Backend
```bash
# Changes to app.js require restart
Ctrl+C  # Stop server
npm start  # Restart
```

---

## 🚫 Issue 15: JWT Token Expired or Invalid

### Problem
```
Error: Invalid token
401 Unauthorized
Cannot POST /api/attendance/bulk-mark
```

### Solutions

#### Solution A: Log Out and Log Back In
```
1. Go to app
2. Click Logout
3. Login again (fresh token)
4. Try again
```

#### Solution B: Check Token
```javascript
// Open DevTools
F12 → Application → Local Storage

// Should have:
Key: token
Value: eyJhbGc...

// If missing, not logged in properly
```

#### Solution C: Check Token Expiration
```javascript
// In console:
localStorage.getItem('token')

// Copy the token
// Go to: jwt.io
// Paste token (left side)
// Check "exp" claim (right side)

// If current time > exp, token expired
// Solution: Log out and log back in
```

---

## 🆘 Getting Help

### Step 1: Identify the Issue
1. Read the error message carefully
2. Check which category above it matches
3. Try solutions in order

### Step 2: Collect Information
```
When asking for help, provide:
1. Error message (exact text)
2. What were you trying to do?
3. What happened instead?
4. Which files did you modify?
5. Browser console errors
6. Backend terminal logs
```

### Step 3: Check Logs

#### Browser Console
```
F12 → Console tab
- Look for red errors
- Screenshot error messages
```

#### Backend Terminal
```bash
# Terminal where backend is running
# Look for error messages
# Copy exact error text
```

#### Database Logs
```sql
-- Some queries might log errors
-- Check SQL Server error log
```

---

## 📊 Debugging Checklist

Before asking for help, verify:

- [ ] Backend running (npm start)
- [ ] Frontend running (npm start)
- [ ] Database connected
- [ ] Courses exist in database
- [ ] Students enrolled in courses
- [ ] Logged in as admin
- [ ] No errors in browser console (F12)
- [ ] No errors in backend terminal
- [ ] Network requests show in F12 Network tab
- [ ] Database has StudentCourses records

---

## 🎯 Still Stuck?

### For Backend Issues
1. Check backend terminal logs
2. Add console.log() to functions
3. Test API with Postman/curl
4. Verify database connectivity
5. Check file modifications

### For Frontend Issues
1. Check browser console (F12)
2. Check Network tab (F12)
3. Verify API URLs match backend
4. Test APIs directly
5. Check file modifications

### For Database Issues
1. Test connection with sqlcmd
2. Verify tables exist
3. Verify data exists
4. Run sample queries
5. Check permissions

---

## 📞 Report Format

When reporting issues:

```
Issue: [One line description]
Steps to reproduce:
1. ...
2. ...
3. ...

Expected: ...
Actual: ...

Error message: [exact text]
Browser console errors: [if any]
Backend logs: [if any]

Environment:
- OS: Windows
- Node: v16+
- Database: SQL Server
```

---

**Most issues resolved by restarting backend and frontend!**

If restart doesn't work, follow the solutions above. 🚀
