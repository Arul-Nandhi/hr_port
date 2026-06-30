# Employee HR Management Portal

A comprehensive web-based HR Management System designed to streamline HR operations, employee management, attendance tracking, leave requests, recruitment processes, and payroll management. Built with React, Bootstrap, and modern JavaScript practices.

---

## Project Overview

The **Employee HR Management Portal** is a full-featured HR system designed for organizations to:
- Manage employee information and records
- Track attendance and leaves
- Process recruitment activities
- Monitor payroll and generate reports
- Provide self-service features to employees
- Generate comprehensive HR reports (PDF/Excel)

---

## Key Features

### 1. **Authentication Module**
- Role-based login (Admin, HR, Employee)
- Secure password management
- Session management with localStorage
- Three distinct user roles with specific permissions

### 2. **Dashboard Module**
- Real-time statistics cards
- Quick statistics overview
- Recent activities feed
- Role-specific dashboard views
- Quick action buttons for HR operations

### 3. **Employee Management Module**
- Add/Edit/Delete employee records
- Search employees by name or ID
- Filter by department
- View detailed employee information
- Display complete employee profile with contact info

### 4. **Department Management Module**
- View all departments
- Display department heads
- Show employee count per department
- Department-wise organization

### 5. **Attendance Management Module**
- Daily attendance marking
- Check-in/Check-out system
- Attendance history tracking
- Monthly attendance reports
- Present/Absent statistics

### 6. **Leave Management Module**
- Apply for leaves (Casual, Sick, Earned)
- Leave request approval/rejection
- Leave balance tracking per employee
- Leave history and status tracking
- Three leave types with different balances

### 7. **Recruitment Module**
- Post job openings
- Track candidate applications
- Update candidate status (Applied → Shortlisted → Interview → Selected/Rejected)
- View candidate details
- Interview scheduling

### 8. **Payroll Module**
- Employee salary information
- Monthly salary records
- Salary slip generation
- Payroll summaries and calculations
- Basic salary, allowances, and deductions tracking

### 9. **Reports Module**
- Employee reports
- Attendance reports
- Leave reports
- Recruitment reports
- PDF and Excel export functionality

### 10. **Notification Module**
- System announcements
- Leave approval notifications
- Recruitment updates
- HR broadcasts

---

## Technology Stack

### Frontend
- **React 19** - UI library with modern hooks
- **React Router v7** - Client-side routing
- **Bootstrap 5** - Responsive CSS framework
- **Custom CSS** - Tailored styling for HR Portal

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework 3.14** - REST API
- **JWT Authentication** - Token-based authentication
- **SQLite/MySQL/PostgreSQL** - Database options

### State Management
- **Context API** - Authentication and HR data management (Frontend)
- **Local Storage** - Session persistence (Frontend)
- **Django ORM** - Backend data management

### Development Tools
- **npm** - Frontend package management
- **pip** - Backend package management
- **Python 3.8+** - Backend runtime

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Main navigation with role-based menu
│   ├── Footer.jsx              # Application footer
│   ├── ProtectedRoute.jsx       # Route protection component
│   ├── common/                 # Shared components
│   └── modules/                # Module-specific components
├── context/
│   ├── AuthContext.js          # Authentication state management
│   └── HRDataContext.js        # HR operations and data management
├── pages/
│   ├── LoginPage.jsx           # Authentication page
│   ├── DashboardPage.jsx       # Main dashboard
│   ├── ProfilePage.jsx         # User profile page
│   ├── EmployeeAttendancePage.jsx  # Employee self-service attendance
│   └── modules/
│       ├── EmployeeManagementPage.jsx     # HR: Manage employees
│       ├── DepartmentManagementPage.jsx   # HR: Manage departments
│       ├── AttendancePage.jsx             # HR: Track attendance
│       ├── LeaveManagementPage.jsx        # HR & Employee: Manage leaves
│       ├── RecruitmentPage.jsx            # HR: Manage recruitment
│       ├── PayrollPage.jsx                # HR: Payroll management
│       └── ReportsPage.jsx                # HR: Generate reports
├── data/
│   └── hrData.js               # Mock data for all HR modules
├── utils/                      # Utility functions
├── App.js                      # Main app component with routing
├── App.css                     # Global styles
└── index.js                    # React entry point
```

---

## Roles & Permissions

### Admin Role
- Full access to all modules
- Employee management
- Department management
- Attendance management
- Leave approval/rejection
- Recruitment management
- Payroll access
- Report generation

### HR Role
- Employee management
- Department management
- Attendance management
- Leave approval/rejection
- Recruitment management
- Payroll access
- Report generation

### Employee Role
- View own profile
- Check attendance
- Apply for leave
- View leave balance
- View leave history
- Self-service features only

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Frontend Setup

1. **Navigate to project directory**
```bash
cd hr_portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The frontend will open at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create and activate virtual environment**
```bash
# Windows:
python -m venv venv
venv\Scripts\activate

# Linux/Mac:
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser**
```bash
python manage.py createsuperuser
```

6. **Populate initial data**
```bash
python manage.py populate_data
```

7. **Start Django development server**
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`
Django Admin at `http://localhost:8000/admin/`

### Running Both Frontend & Backend

**Terminal 1 - Frontend:**
```bash
cd hr_portal
npm start
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

Both services must be running for full functionality.

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin | admin123 |
| HR | hr | hr123 |
| Employee | john | emp123 |

---

## Build & Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deploy
The application can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

---

## Features in Detail

### Dashboard
- Total employees count
- Active employees statistics
- Department count
- Pending leave requests
- Open job positions
- Today's attendance summary
- Recent leave requests feed
- Recent attendance updates

### Employee Management
- Search by name or ID
- Filter by department
- Add new employee with full details
- Edit employee information
- Delete employee records
- View department assignment

### Attendance
- Date-wise attendance tracking
- Check-in/Check-out times
- Present/Absent statistics
- Search by employee
- Monthly attendance records

### Leave Management
- Apply for three types of leaves (Casual, Sick, Earned)
- View leave balance
- Track leave requests
- HR can approve/reject leaves
- Status tracking (Pending/Approved/Rejected)
- Leave history

### Recruitment
- View open positions
- Add new candidates
- Update candidate status through pipeline
- Track hiring progress
- Interview scheduling notes

### Payroll
- View employee salary details
- Net salary calculation
- Allowances and deductions
- Monthly payroll records
- Salary slip preview

### Reports
- Employee summary report
- Attendance analytics
- Leave utilization report
- Recruitment funnel report
- PDF/Excel export options

---

## Frontend Architecture

### Context-based State Management
- **AuthContext**: Manages user authentication and session
- **HRDataContext**: Manages all HR operations and data

### Protected Routes
- Routes are protected based on user role
- Unauthorized access redirects to login
- Role-based route protection implemented

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Custom CSS for HR Portal theme
- Tested on multiple screen sizes

---

## Styling & Theme

### Color Scheme
- Primary: #4f46e5 (Indigo)
- Accent: #06b6d4 (Cyan)
- Success: #10b981 (Green)
- Danger: #ef4444 (Red)
- Warning: #f59e0b (Amber)

### Typography
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800
- Scalable for all screen sizes

---

## Best Practices Implemented

✓ Component-based architecture
✓ Context API for state management
✓ Protected routes with role-based access
✓ Responsive mobile-first design
✓ Clean and maintainable code structure
✓ Reusable components
✓ Error handling
✓ Form validation
✓ Consistent styling
✓ Accessibility considerations

---

## Resume Description

**Employee HR Management Portal**

Developed a comprehensive web-based HR Management System using React, Context API, Bootstrap, and custom CSS. The application manages employee records, attendance tracking, leave requests, recruitment processes, payroll information, and report generation through a centralized dashboard with role-based access control (Admin, HR, Employee). Implemented CRUD operations, protected routes, responsive UI, and organized state management using React Context. Features include multi-module support, dashboard analytics, advanced filtering, status tracking, and PDF/Excel export functionality. Successfully demonstrates full-stack web development capabilities including frontend architecture, component design, state management, and modern React practices.

---

## Future Enhancements

1. **API Integration**
   - ✅ Django backend created with REST API
   - Update React components to use real API endpoints
   - Implement error handling for API responses
   - Add loading states and spinners

2. **Advanced Features**
   - Attendance calendar view
   - Advanced filtering and search
   - Bulk employee import (CSV)
   - Email notifications
   - Performance reviews
   - Training management

3. **Reporting**
   - Advanced analytics dashboard
   - Custom report builder
   - Scheduled reports
   - Email report delivery

4. **Security**
   - Two-factor authentication
   - Audit logs
   - Data encryption
   - API rate limiting

5. **Mobile App**
   - React Native mobile application
   - Attendance marking from mobile
   - Leave application on-the-go
   - Notifications

---

## Version History

**v1.0.0** - Initial Release
- Complete HR Portal with 10 modules
- Authentication with roles
- Dashboard and reporting
- All core features implemented

---

**Last Updated**: June 2026
**Status**: Complete & Ready for Production Integration

