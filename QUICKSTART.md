# Quick Start Guide - HR Management Portal

This guide will help you set up and run the complete HR Management Portal (Frontend + Backend) in less than 10 minutes.

---

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (v14+) - Download from https://nodejs.org/
- **Python** (v3.8+) - Download from https://www.python.org/
- **Git** (optional) - Download from https://git-scm.com/

Verify installation:
```bash
node --version    # Should show v14 or higher
python --version  # Should show 3.8 or higher
npm --version     # Should show 8 or higher
```

---

## 🚀 Automatic Startup (Recommended)

### Windows Users
1. Open Command Prompt in the project root directory
2. Double-click `start.bat` file
3. Two windows will open - wait 5 seconds for both to fully load
4. Open browser to http://localhost:3000

### Linux/Mac Users
1. Open Terminal in the project root directory
2. Make the script executable: `chmod +x start.sh`
3. Run: `./start.sh`
4. Open browser to http://localhost:3000

---

## 🔧 Manual Setup

If the automatic startup doesn't work, follow these steps:

### Step 1: Backend Setup (Terminal 1)

```bash
# Navigate to backend
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

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# (First time only) Create superuser
python manage.py createsuperuser

# (First time only) Populate sample data
python manage.py populate_data

# Start backend server
python manage.py runserver
```

Backend will run on: http://localhost:8000/api/

### Step 2: Frontend Setup (Terminal 2)

```bash
# Navigate to project root
cd hr_portal

# Install dependencies
npm install

# Start frontend server
npm start
```

Frontend will open at: http://localhost:3000

---

## 🔑 Login Credentials

Use these credentials to test the application:

### Admin Account
- **Username**: admin
- **Password**: admin123
- **Access**: Full access to all modules

### HR Manager Account
- **Username**: hr
- **Password**: hr123
- **Access**: HR operations (recruitment, leave approval, etc.)

### Employee Account
- **Username**: john
- **Password**: emp123
- **Access**: Self-service features only

---

## 📍 Important URLs

After startup, these URLs will be available:

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | React Frontend (HR Portal) |
| http://localhost:8000 | Django Admin |
| http://localhost:8000/admin | Django Admin Panel |
| http://localhost:8000/api | API Root Endpoint |
| http://localhost:8000/api/users/login | Login API |
| http://localhost:8000/api/employees | Employees API |

---

## ✨ Key Features to Try

1. **Dashboard** - View HR statistics and quick overview
2. **Employee Management** - Add, edit, delete employee records
3. **Attendance** - Mark attendance and view reports
4. **Leave Management** - Apply for leaves and approve/reject (as HR)
5. **Recruitment** - Post jobs and manage candidates
6. **Payroll** - View salary information
7. **Reports** - Generate and export reports

---

## 🆘 Troubleshooting

### Port Already in Use

If you see "port 3000 is already in use" or "port 8000 is already in use":

```bash
# Change backend port
python manage.py runserver 8001

# Change frontend port
PORT=3001 npm start
```

Then update CORS_ALLOWED_ORIGINS in `backend/hr_management/settings.py`

### Virtual Environment Issues

Windows:
```bash
# If venv\Scripts\activate doesn't work
python -m venv venv
```

Linux/Mac:
```bash
# If source venv/bin/activate doesn't work
python3 -m venv venv
source venv/bin/activate
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
pip install --no-cache-dir -r requirements.txt
```

### Frontend Not Starting

```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
npm start
```

### Database Issues

```bash
# Reset database (delete all data)
rm backend/db.sqlite3
python manage.py makemigrations
python manage.py migrate
python manage.py populate_data
```

---

## 📚 Documentation

- **Full Backend Documentation**: See `backend/README.md`
- **API Endpoints**: All available at `http://localhost:8000/api`
- **Main Project README**: See `README.md`

---

## 🔐 Security Notes

### Development Only
- Debug mode is ON
- Secret key is exposed (for development only)
- CORS allows all specified domains

### Before Production Deployment
1. Change SECRET_KEY in `settings.py`
2. Set DEBUG = False
3. Update CORS_ALLOWED_ORIGINS
4. Use environment variables for sensitive data
5. Configure proper database (MySQL/PostgreSQL)
6. Set up HTTPS/SSL

---

## 💡 Tips

1. **Keep two terminal windows open** - one for backend, one for frontend
2. **Check terminal output** for errors or important messages
3. **Hard refresh browser** (Ctrl+Shift+R) if styles don't load
4. **Check Chrome DevTools** (F12) for frontend errors
5. **Use Django admin** (http://localhost:8000/admin) to manage database directly

---

## 📞 Support

If you encounter issues:

1. Check the error message in terminal
2. Verify all prerequisites are installed
3. Review the full README files
4. Check API documentation at `http://localhost:8000/api`
5. Review backend logs for API errors

---

## ✅ Checklist Before Using

- [ ] Node.js installed and working
- [ ] Python installed and working
- [ ] Project folder downloaded/cloned
- [ ] You're in the project root directory
- [ ] You understand the two components (Frontend & Backend)
- [ ] You have credentials ready for login

---

## 🎉 Ready to Go!

You're all set! The HR Management Portal is ready to use.

**Next Step**: Run the startup command (Windows: `start.bat` or Linux/Mac: `./start.sh`)

**Time to complete setup**: ~5-10 minutes
**Time to first use**: ~15 minutes (including initial data population)

Enjoy!
