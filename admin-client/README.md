# Admin Portal - Student Dashboard

This is the admin portal for managing the Student Dashboard application.

## Setup

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

The admin portal will run on `http://localhost:3001`

## Features

- Admin Authentication
- Student Management
- Course Management
- Attendance Management
- Results Management
- Examination Management
- Timetable Management
- Fee Management
- Payment Management

## API

The admin portal connects to the backend API at `http://localhost:5000`

### Admin Authentication Endpoints

- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/profile` - Get admin profile

## Default Admin Credentials

- Username: `admin`
- Password: `Admin@123`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.
