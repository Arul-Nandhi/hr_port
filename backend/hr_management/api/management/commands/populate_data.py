from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hr_management.api.models import Department, Employee, Attendance, LeaveRequest, LeaveBalance, JobOpening, Candidate, Payroll, Announcement
from datetime import date, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with initial data for HR Portal'

    def handle(self, *args, **options):
        self.stdout.write('Starting data population...')

        # Create Users
        self.stdout.write('Creating users...')
        users = {}
        if not User.objects.filter(username='admin').exists():
            users['admin'] = User.objects.create_superuser(
                username='admin',
                email='admin@gmail.com',
                password='admin123',
                role='Admin',
                first_name='Admin',
                last_name='User'
            )

        if not User.objects.filter(username='hr').exists():
            users['hr'] = User.objects.create_user(
                username='hr',
                email='hr@gmail.com',
                password='hr123',
                role='HR',
                first_name='HR',
                last_name='Manager'
            )

        if not User.objects.filter(username='john').exists():
            users['john'] = User.objects.create_user(
                username='john',
                email='john@gmail.com',
                password='emp123',
                role='Employee',
                first_name='John',
                last_name='Doe'
            )
        else:
            users['john'] = User.objects.get(username='john')

        if 'admin' not in users and User.objects.filter(username='admin').exists():
            users['admin'] = User.objects.get(username='admin')
        if 'hr' not in users and User.objects.filter(username='hr').exists():
            users['hr'] = User.objects.get(username='hr')

        # Create Departments
        self.stdout.write('Creating departments...')
        departments = {}
        dept_data = [
            {'name': 'Technology', 'head': 'John Doe'},
            {'name': 'Human Resources', 'head': 'Sarah Smith'},
            {'name': 'Marketing', 'head': 'Priya Sharma'},
            {'name': 'Finance', 'head': 'Rajesh Patel'},
        ]
        
        for dept in dept_data:
            d, created = Department.objects.get_or_create(
                department_name=dept['name'],
                defaults={'department_head': dept['head']}
            )
            departments[dept['name']] = d

        # Create Employees
        self.stdout.write('Creating employees...')
        employees = {}
        emp_data = [
            {'id': 'EMP001', 'name': 'John Doe', 'email': 'john@gmail.com', 'phone': '+91-9876543210', 'dept': 'Technology', 'designation': 'Senior Software Engineer', 'joining': date(2023, 6, 15)},
            {'id': 'EMP002', 'name': 'Sarah Smith', 'email': 'sarah@gmail.com', 'phone': '+91-9876543211', 'dept': 'Human Resources', 'designation': 'HR Executive', 'joining': date(2024, 1, 10)},
            {'id': 'EMP003', 'name': 'Ravi Kumar', 'email': 'ravi@gmail.com', 'phone': '+91-9876543212', 'dept': 'Technology', 'designation': 'Junior Developer', 'joining': date(2024, 8, 1)},
            {'id': 'EMP004', 'name': 'Priya Sharma', 'email': 'priya@gmail.com', 'phone': '+91-9876543213', 'dept': 'Marketing', 'designation': 'Marketing Manager', 'joining': date(2023, 3, 20)},
        ]
        
        for emp in emp_data:
            user_obj = None
            if emp['id'] == 'EMP001':
                user_obj = users.get('john')
            elif emp['id'] == 'EMP002':
                user_obj = users.get('hr')

            e, created = Employee.objects.get_or_create(
                employee_id=emp['id'],
                defaults={
                    'name': emp['name'],
                    'email': emp['email'],
                    'phone': emp['phone'],
                    'department': departments[emp['dept']],
                    'designation': emp['designation'],
                    'joining_date': emp['joining'],
                    'address': f'{emp["id"]} Street, Bangalore',
                    'user': user_obj
                }
            )
            if not created and e.user is None and user_obj is not None:
                e.user = user_obj
                e.save()
            employees[emp['id']] = e

        # Create Leave Balances
        self.stdout.write('Creating leave balances...')
        for emp in employees.values():
            LeaveBalance.objects.get_or_create(employee=emp)

        # Create Attendance
        self.stdout.write('Creating attendance records...')
        today = date.today()
        for i in range(5):
            att_date = today - timedelta(days=i)
            for emp_id in ['EMP001', 'EMP002', 'EMP003']:
                Attendance.objects.get_or_create(
                    employee=employees[emp_id],
                    date=att_date,
                    defaults={
                        'check_in': '09:00',
                        'check_out': '18:00',
                        'status': 'Present'
                    }
                )

        # Create Leave Requests
        self.stdout.write('Creating leave requests...')
        leave_requests_data = [
            {
                'employee': employees['EMP001'],
                'leave_type': 'Casual Leave',
                'reason': 'Personal work',
                'status': 'Pending',
                'days_offset_start': 10,
                'days_offset_end': 12
            },
            {
                'employee': employees['EMP002'],
                'leave_type': 'Sick Leave',
                'reason': 'Medical appointment',
                'status': 'Approved',
                'days_offset_start': -5,
                'days_offset_end': -5
            },
            {
                'employee': employees['EMP003'],
                'leave_type': 'Earned Leave',
                'reason': 'Family vacation',
                'status': 'Rejected',
                'days_offset_start': 20,
                'days_offset_end': 25
            }
        ]
        
        for lr in leave_requests_data:
            LeaveRequest.objects.get_or_create(
                employee=lr['employee'],
                leave_type=lr['leave_type'],
                reason=lr['reason'],
                defaults={
                    'start_date': today + timedelta(days=lr['days_offset_start']),
                    'end_date': today + timedelta(days=lr['days_offset_end']),
                    'status': lr['status']
                }
            )

        # Create Job Openings
        self.stdout.write('Creating job openings...')
        jobs = {}
        job_data = [
            {'position': 'Senior Developer', 'dept': 'Technology'},
            {'position': 'Business Analyst', 'dept': 'Marketing'},
        ]
        
        for job in job_data:
            j, created = JobOpening.objects.get_or_create(
                position=job['position'],
                department=departments[job['dept']],
                defaults={
                    'description': f'Looking for experienced {job["position"]}',
                    'deadline': today + timedelta(days=30),
                    'status': 'Open'
                }
            )
            jobs[job['position']] = j

        # Create Candidates
        self.stdout.write('Creating candidates...')
        candidate_data = [
            {'name': 'Amit Patel', 'email': 'amit.patel@email.com', 'phone': '+91-9876543214', 'position': 'Senior Developer', 'status': 'Interview Scheduled'},
            {'name': 'Neha Gupta', 'email': 'neha.gupta@email.com', 'phone': '+91-9876543215', 'position': 'Senior Developer', 'status': 'Shortlisted'},
            {'name': 'Vikram Singh', 'email': 'vikram.singh@email.com', 'phone': '+91-9876543216', 'position': 'Business Analyst', 'status': 'Applied'},
        ]
        
        for cand in candidate_data:
            Candidate.objects.get_or_create(
                email=cand['email'],
                defaults={
                    'name': cand['name'],
                    'phone': cand['phone'],
                    'job_opening': jobs[cand['position']],
                    'status': cand['status']
                }
            )

        # Create Payroll
        self.stdout.write('Creating payroll records...')
        payroll_data = [
            {'emp_id': 'EMP001', 'basic': 60000, 'allowances': 15000, 'deductions': 5000},
            {'emp_id': 'EMP002', 'basic': 45000, 'allowances': 10000, 'deductions': 3500},
            {'emp_id': 'EMP003', 'basic': 35000, 'allowances': 8000, 'deductions': 2500},
        ]
        
        for pay in payroll_data:
            Payroll.objects.get_or_create(
                employee=employees[pay['emp_id']],
                month='June 2026',
                year=2026,
                defaults={
                    'basic_salary': pay['basic'],
                    'allowances': pay['allowances'],
                    'deductions': pay['deductions'],
                    'net_salary': pay['basic'] + pay['allowances'] - pay['deductions']
                }
            )

        # Create Announcements
        self.stdout.write('Creating announcements...')
        Announcement.objects.get_or_create(
            title='New Office Timings',
            defaults={
                'content': 'Office timings changed to 9 AM - 6 PM from next Monday',
                'announcement_type': 'general',
                'is_active': True
            }
        )

        self.stdout.write(self.style.SUCCESS('Data population completed successfully!'))
