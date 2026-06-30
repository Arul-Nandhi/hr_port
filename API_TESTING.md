# API Testing Guide

Use these curl commands to test the HR Portal REST API. Make sure the backend is running on `http://localhost:8000`

---

## 1️⃣ Authentication Tests

### Login and Get Tokens

```bash
# Login as admin
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Save the access token from response** - you'll use it for all other requests.

Example response:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@gmail.com",
    "role": "Admin"
  }
}
```

### Get Current User Info

```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Refresh Token

```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN_HERE"}'
```

---

## 2️⃣ Employee Management Tests

### List All Employees

```bash
curl -X GET http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Single Employee

```bash
curl -X GET http://localhost:8000/api/employees/EMP001/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Create New Employee

```bash
curl -X POST http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP005",
    "name": "Arun Kumar",
    "email": "arun@gmail.com",
    "phone": "+91-9999999999",
    "department": 1,
    "designation": "Full Stack Developer",
    "joining_date": "2026-06-15",
    "address": "456 Tech Street, Bangalore"
  }'
```

### Update Employee

```bash
curl -X PUT http://localhost:8000/api/employees/EMP005/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "designation": "Senior Full Stack Developer"
  }'
```

### Get Active Employees

```bash
curl -X GET http://localhost:8000/api/employees/active/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Employee Attendance Summary

```bash
curl -X GET http://localhost:8000/api/employees/EMP001/attendance_summary/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 3️⃣ Attendance Tests

### List All Attendance Records

```bash
curl -X GET http://localhost:8000/api/attendance/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Today's Attendance

```bash
curl -X GET http://localhost:8000/api/attendance/today/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Mark Attendance

```bash
curl -X POST http://localhost:8000/api/attendance/mark_attendance/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "check_in": "09:00:00",
    "check_out": "18:00:00",
    "status": "Present"
  }'
```

### Filter Attendance by Status

```bash
curl -X GET "http://localhost:8000/api/attendance/?status=Present" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 4️⃣ Leave Management Tests

### List Leave Requests

```bash
curl -X GET http://localhost:8000/api/leave-requests/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Apply for Leave

```bash
curl -X POST http://localhost:8000/api/leave-requests/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "leave_type": "Casual Leave",
    "start_date": "2026-07-10",
    "end_date": "2026-07-12",
    "reason": "Personal work"
  }'
```

### Approve Leave (HR Only)

```bash
curl -X POST http://localhost:8000/api/leave-requests/1/approve/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Reject Leave (HR Only)

```bash
curl -X POST http://localhost:8000/api/leave-requests/1/reject/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Get Leave Balance

```bash
curl -X GET "http://localhost:8000/api/leave-balance/by_employee/?employee_id=EMP001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 5️⃣ Recruitment Tests

### List Job Openings

```bash
curl -X GET http://localhost:8000/api/job-openings/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### List Candidates

```bash
curl -X GET http://localhost:8000/api/candidates/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Add Candidate

```bash
curl -X POST http://localhost:8000/api/candidates/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Akshay Reddy",
    "email": "akshay@email.com",
    "phone": "+91-9876543220",
    "job_opening": 1,
    "status": "Applied"
  }'
```

### Update Candidate Status

```bash
curl -X POST http://localhost:8000/api/candidates/1/update_status/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shortlisted"
  }'
```

---

## 6️⃣ Payroll Tests

### List Payroll Records

```bash
curl -X GET http://localhost:8000/api/payroll/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Employee Payroll

```bash
curl -X GET "http://localhost:8000/api/payroll/by_employee/?employee_id=EMP001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Create Payroll Record

```bash
curl -X POST http://localhost:8000/api/payroll/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "employee": 1,
    "basic_salary": "60000.00",
    "allowances": "15000.00",
    "deductions": "5000.00",
    "bonus": "0.00",
    "month": "July 2026",
    "year": 2026
  }'
```

---

## 7️⃣ Dashboard Tests

### Get Dashboard Statistics

```bash
curl -X GET http://localhost:8000/api/dashboard/stats/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Response:
```json
{
  "total_employees": 4,
  "active_employees": 4,
  "departments_count": 4,
  "pending_leaves": 1,
  "open_jobs": 2,
  "present_today": 3
}
```

---

## 8️⃣ Department Tests

### List Departments

```bash
curl -X GET http://localhost:8000/api/departments/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Department Employees

```bash
curl -X GET http://localhost:8000/api/departments/1/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 💡 Tips for Testing

### Pretty Print JSON Responses

Install jq (Windows, Linux, Mac all supported):
```bash
# Windows (using chocolatey)
choco install jq

# Then use in commands:
curl -X GET http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" | jq
```

### Save Response to File

```bash
curl -X GET http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" > employees.json
```

### Test with Filters

```bash
# Search
curl -X GET "http://localhost:8000/api/employees/?search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Ordering
curl -X GET "http://localhost:8000/api/employees/?ordering=name" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Pagination
curl -X GET "http://localhost:8000/api/employees/?page=2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 🛠️ Recommended Tools

For better API testing experience, use:

1. **Postman** - https://www.postman.com/downloads/
2. **Insomnia** - https://insomnia.rest/download
3. **Thunder Client** (VS Code extension)
4. **REST Client** (VS Code extension)

---

## 📝 Important Notes

1. **Token Expiration**: Access tokens expire after 1 hour. Use refresh token to get a new one.
2. **Authentication**: All endpoints except `/login/` require bearer token
3. **CORS**: Frontend on port 3000 is allowed by default
4. **Pagination**: Default 10 items per page
5. **Django Admin**: http://localhost:8000/admin (username: admin, password: admin123)

---

## ✅ Quick Test Checklist

- [ ] Login works and returns token
- [ ] Can access /users/me/ endpoint
- [ ] Can list employees
- [ ] Can create new employee
- [ ] Can mark attendance
- [ ] Can apply for leave
- [ ] Can view dashboard stats
- [ ] All endpoints return proper JSON

Good luck with testing! 🚀
