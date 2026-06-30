// ============================================================
// HR Portal Mock Data
// Replace with API calls when connecting to backend
// ============================================================

export const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "Admin",
    created_at: "2026-01-01",
  },
  {
    id: 2,
    name: "HR Manager",
    email: "hr@gmail.com",
    password: "hr123",
    role: "HR",
    created_at: "2026-01-05",
  },
  {
    id: 3,
    name: "John Doe",
    email: "john@gmail.com",
    password: "emp123",
    role: "Employee",
    created_at: "2026-01-10",
  },
];

export const employees = [
  {
    employee_id: "EMP001",
    name: "John Doe",
    email: "john@gmail.com",
    phone: "+91-9876543210",
    department_id: 1,
    designation: "Senior Software Engineer",
    joining_date: "2023-06-15",
    address: "123 Main St, Bangalore",
    salary_id: 1,
  },
  {
    employee_id: "EMP002",
    name: "Sarah Smith",
    email: "sarah@gmail.com",
    phone: "+91-9876543211",
    department_id: 2,
    designation: "HR Executive",
    joining_date: "2024-01-10",
    address: "456 Oak Ave, Bangalore",
    salary_id: 2,
  },
  {
    employee_id: "EMP003",
    name: "Ravi Kumar",
    email: "ravi@gmail.com",
    phone: "+91-9876543212",
    department_id: 1,
    designation: "Junior Developer",
    joining_date: "2024-08-01",
    address: "789 Elm St, Bangalore",
    salary_id: 3,
  },
  {
    employee_id: "EMP004",
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "+91-9876543213",
    department_id: 3,
    designation: "Marketing Manager",
    joining_date: "2023-03-20",
    address: "321 Pine Rd, Bangalore",
    salary_id: 4,
  },
];

export const departments = [
  {
    department_id: 1,
    department_name: "Technology",
    department_head: "John Doe",
    employees_count: 45,
  },
  {
    department_id: 2,
    department_name: "Human Resources",
    department_head: "Sarah Smith",
    employees_count: 8,
  },
  {
    department_id: 3,
    department_name: "Marketing",
    department_head: "Priya Sharma",
    employees_count: 12,
  },
  {
    department_id: 4,
    department_name: "Finance",
    department_head: "Rajesh Patel",
    employees_count: 10,
  },
];

export const attendance = [
  {
    attendance_id: 1,
    employee_id: "EMP001",
    date: "2026-06-20",
    check_in: "09:00 AM",
    check_out: "06:00 PM",
    status: "Present",
  },
  {
    attendance_id: 2,
    employee_id: "EMP001",
    date: "2026-06-19",
    check_in: "09:15 AM",
    check_out: "05:45 PM",
    status: "Present",
  },
  {
    attendance_id: 3,
    employee_id: "EMP002",
    date: "2026-06-20",
    check_in: "09:30 AM",
    check_out: "06:15 PM",
    status: "Present",
  },
  {
    attendance_id: 4,
    employee_id: "EMP003",
    date: "2026-06-20",
    check_in: null,
    check_out: null,
    status: "Absent",
  },
];

export const leaveRequests = [
  {
    leave_id: 1,
    employee_id: "EMP001",
    employee_name: "John Doe",
    leave_type: "Casual Leave",
    start_date: "2026-07-01",
    end_date: "2026-07-03",
    reason: "Personal work",
    status: "Pending",
    applied_date: "2026-06-20",
  },
  {
    leave_id: 2,
    employee_id: "EMP002",
    employee_name: "Sarah Smith",
    leave_type: "Sick Leave",
    start_date: "2026-06-22",
    end_date: "2026-06-22",
    reason: "Medical appointment",
    status: "Approved",
    applied_date: "2026-06-20",
  },
  {
    leave_id: 3,
    employee_id: "EMP003",
    employee_name: "Ravi Kumar",
    leave_type: "Earned Leave",
    start_date: "2026-07-10",
    end_date: "2026-07-15",
    reason: "Family vacation",
    status: "Rejected",
    applied_date: "2026-06-15",
  },
];

export const leaveBalance = [
  {
    employee_id: "EMP001",
    casual_leave: 8,
    sick_leave: 8,
    earned_leave: 20,
  },
  {
    employee_id: "EMP002",
    casual_leave: 5,
    sick_leave: 7,
    earned_leave: 18,
  },
  {
    employee_id: "EMP003",
    casual_leave: 10,
    sick_leave: 8,
    earned_leave: 20,
  },
];

export const jobOpenings = [
  {
    job_id: 1,
    position: "Senior Developer",
    department_id: 1,
    description: "Looking for experienced senior developer",
    posted_date: "2026-05-15",
    deadline: "2026-07-15",
    status: "Open",
  },
  {
    job_id: 2,
    position: "Business Analyst",
    department_id: 3,
    description: "BA required for new project",
    posted_date: "2026-06-01",
    deadline: "2026-07-01",
    status: "Open",
  },
];

export const candidates = [
  {
    candidate_id: 1,
    name: "Amit Patel",
    email: "amit.patel@email.com",
    phone: "+91-9876543214",
    position: "Senior Developer",
    status: "Interview Scheduled",
    applied_date: "2026-06-01",
    interview_date: "2026-06-25",
  },
  {
    candidate_id: 2,
    name: "Neha Gupta",
    email: "neha.gupta@email.com",
    phone: "+91-9876543215",
    position: "Senior Developer",
    status: "Shortlisted",
    applied_date: "2026-06-03",
  },
  {
    candidate_id: 3,
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91-9876543216",
    position: "Business Analyst",
    status: "Applied",
    applied_date: "2026-06-10",
  },
];

export const payroll = [
  {
    salary_id: 1,
    employee_id: "EMP001",
    basic_salary: 60000,
    allowances: 15000,
    deductions: 5000,
    net_salary: 70000,
    month: "June 2026",
  },
  {
    salary_id: 2,
    employee_id: "EMP002",
    basic_salary: 45000,
    allowances: 10000,
    deductions: 3500,
    net_salary: 51500,
    month: "June 2026",
  },
  {
    salary_id: 3,
    employee_id: "EMP003",
    basic_salary: 35000,
    allowances: 8000,
    deductions: 2500,
    net_salary: 40500,
    month: "June 2026",
  },
];

export const announcements = [
  {
    id: 1,
    title: "New Office Timings",
    content: "Office timings changed to 9 AM - 6 PM from next Monday",
    date: "2026-06-20",
    type: "general",
  },
  {
    id: 2,
    title: "Performance Review Schedule",
    content: "Performance reviews will be conducted from July 1-15",
    date: "2026-06-19",
    type: "general",
  },
];
