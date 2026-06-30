# HR Management Portal - Django Backend

Complete REST API backend for the Employee HR Management Portal built with Django and Django REST Framework.

---

## Features

✅ **User Authentication** - JWT token-based authentication with role-based access control
✅ **Employee Management** - Full CRUD operations for employee records
✅ **Attendance Tracking** - Daily check-in/check-out with status tracking
✅ **Leave Management** - Apply, approve, and track leave requests
✅ **Department Management** - Manage organizational structure
✅ **Recruitment** - Job openings and candidate tracking
✅ **Payroll Management** - Salary calculations and payslip generation
✅ **Reports** - Multiple reporting endpoints
✅ **Admin Interface** - Django admin with customized models

---

## Technology Stack

- **Framework**: Django 4.2
- **API**: Django REST Framework 3.14
- **Authentication**: JWT (djangorestframework-simplejwt)
- **CORS**: django-cors-headers
- **Database**: SQLite (default), MySQL, PostgreSQL compatible

---

## Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── hr_management/
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL routing
│   ├── wsgi.py              # WSGI config
│   └── __init__.py
└── api/
    ├── models.py            # Database models
    ├── views.py             # ViewSets and API endpoints
    ├── serializers.py       # DRF serializers
    ├── urls.py              # API routing
    ├── admin.py             # Django admin config
    ├── apps.py              # App configuration
    ├── management/
    │   └── commands/
    │       └── populate_data.py  # Initial data command
    └── migrations/
```

---

## Installation & Setup

### 1. Install Python & Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Database

Default configuration uses SQLite. To use MySQL:

Edit `hr_management/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hr_portal_db',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### 3. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

### 5. Populate Initial Data

```bash
python manage.py populate_data
```

This creates:
- 3 demo users (Admin, HR, Employee)
- 4 departments
- 4 employees
- Attendance records
- Leave requests
- Job openings
- Candidates
- Payroll records
- Announcements

### 6. Start Development Server

```bash
python manage.py runserver
```

API will be available at: `http://localhost:8000/api/`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/login/` | User login |
| GET | `/api/users/me/` | Get current user info |
| POST | `/api/users/change_password/` | Change password |
| POST | `/api/users/logout/` | Logout |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | List all employees |
| POST | `/api/employees/` | Create employee |
| GET | `/api/employees/{id}/` | Get employee details |
| PUT | `/api/employees/{id}/` | Update employee |
| DELETE | `/api/employees/{id}/` | Delete employee |
| GET | `/api/employees/active/` | Get active employees |
| GET | `/api/employees/{id}/attendance_summary/` | Get attendance summary |

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments/` | List departments |
| POST | `/api/departments/` | Create department |
| GET | `/api/departments/{id}/` | Get department details |
| GET | `/api/departments/{id}/employees/` | Get department employees |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/` | List attendance records |
| POST | `/api/attendance/` | Create attendance |
| GET | `/api/attendance/today/` | Get today's attendance |
| POST | `/api/attendance/mark_attendance/` | Mark attendance |

### Leave Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leave-requests/` | List leave requests |
| POST | `/api/leave-requests/` | Create leave request |
| POST | `/api/leave-requests/{id}/approve/` | Approve leave |
| POST | `/api/leave-requests/{id}/reject/` | Reject leave |
| GET | `/api/leave-balance/by_employee/` | Get leave balance |

### Recruitment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-openings/` | List job openings |
| POST | `/api/job-openings/` | Create job opening |
| GET | `/api/candidates/` | List candidates |
| POST | `/api/candidates/` | Add candidate |
| POST | `/api/candidates/{id}/update_status/` | Update candidate status |

### Payroll

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payroll/` | List payroll records |
| POST | `/api/payroll/` | Create payroll |
| GET | `/api/payroll/by_employee/` | Get employee payroll |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats/` | Get dashboard statistics |

---

## API Request Examples

### Login

```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@gmail.com",
    "role": "Admin"
  }
}
```

### Get Employees

```bash
curl -X GET http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Employee

```bash
curl -X POST http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP005",
    "name": "New Employee",
    "email": "new@gmail.com",
    "phone": "+91-9999999999",
    "department": 1,
    "designation": "Developer",
    "joining_date": "2026-06-15",
    "address": "123 Street, City"
  }'
```

### Apply Leave

```bash
curl -X POST http://localhost:8000/api/leave-requests/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "leave_type": "Casual Leave",
    "start_date": "2026-07-01",
    "end_date": "2026-07-03",
    "reason": "Personal work"
  }'
```

### Approve Leave

```bash
curl -X POST http://localhost:8000/api/leave-requests/1/approve/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Authentication

All API endpoints (except login) require JWT token authentication.

### Get Access Token

```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Use Token in Requests

```bash
curl -X GET http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer ACCESS_TOKEN_HERE"
```

### Refresh Token

```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "REFRESH_TOKEN_HERE"}'
```

---

## Django Admin

Access admin interface at: `http://localhost:8000/admin/`

**Default credentials:**
- Username: admin
- Password: admin123 (created during setup)

---

## Role-Based Access Control

### Admin Role
- Full access to all endpoints
- Can manage users
- Can approve/reject leaves
- Can create job openings
- Can view reports

### HR Role
- Access to all modules except user management
- Can approve/reject leaves
- Can manage candidates
- Can create payroll records

### Employee Role
- View own profile
- View own attendance
- Apply for leave
- View own payroll

---

## Database Models

### User
- Custom user model with role field
- Email-based authentication

### Employee
- Links to User model
- Department association
- Personal information

### Attendance
- Daily check-in/check-out
- Status tracking
- Employee reference

### LeaveRequest
- Leave type (Casual, Sick, Earned, Maternity)
- Status tracking (Pending, Approved, Rejected, Cancelled)
- Approval workflow

### Department
- Organizational structure
- Employee count tracking

### JobOpening
- Position details
- Deadline tracking
- Status management

### Candidate
- Recruitment pipeline
- Interview tracking
- Rating system

### Payroll
- Salary calculations
- Allowances and deductions
- Net salary computation

---

## Filtering & Search

All list endpoints support filtering and searching:

### Search

```bash
# Search employees
GET /api/employees/?search=john

# Search candidates
GET /api/candidates/?search=amit
```

### Filter

```bash
# Filter by status
GET /api/leave-requests/?status=Pending

# Filter by date
GET /api/attendance/?date=2026-06-20

# Filter by department
GET /api/employees/?department=1
```

### Ordering

```bash
# Order by name
GET /api/employees/?ordering=name

# Order by date (descending)
GET /api/attendance/?ordering=-date
```

---

## Pagination

Default pagination: 10 items per page

```bash
# Get page 2
GET /api/employees/?page=2
```

Response includes pagination metadata:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/employees/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Error Handling

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## Production Deployment

### Security Settings

Edit `hr_management/settings.py`:

```python
DEBUG = False
SECRET_KEY = 'your-secret-key-here'
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Use production database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hr_portal_db',
        'USER': 'db_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### Collect Static Files

```bash
python manage.py collectstatic
```

### Run with Production Server

```bash
# Using Gunicorn
gunicorn hr_management.wsgi:application --bind 0.0.0.0:8000
```

---

## Troubleshooting

### Port Already in Use
```bash
python manage.py runserver 8001
```

### Database Migration Error
```bash
python manage.py makemigrations api
python manage.py migrate api
```

### Permission Denied
Ensure JWT token is valid and user has appropriate role permissions.

### CORS Error
Check `CORS_ALLOWED_ORIGINS` in settings.py

---

## File Uploads

To enable resume uploads, add MEDIA settings:

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## Testing

Run tests:
```bash
python manage.py test
```

---

## API Documentation

Interactive API documentation available at:
- Browse API: `http://localhost:8000/api/`
- All endpoints have built-in documentation

---

## Future Enhancements

1. Advanced analytics dashboard
2. Email notifications
3. Attendance calendar view
4. Performance review system
5. Training management
6. Custom report builder
7. Bulk data import (CSV)
8. Two-factor authentication

---

## Support & Issues

For bugs or issues, create an issue in the project repository.

---

## License

This project is part of a portfolio. Use and modify as needed.

---

## Summary

This Django backend provides a complete REST API for the HR Management Portal with:
- ✅ 50+ API endpoints
- ✅ Role-based access control
- ✅ JWT authentication
- ✅ Comprehensive data models
- ✅ Full CRUD operations
- ✅ Admin interface
- ✅ Mock data generation
- ✅ Production-ready structure

**Ready for integration with React frontend!**
