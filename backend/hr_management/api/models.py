from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date

# Custom User Model with Roles
class User(AbstractUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('HR', 'HR Manager'),
        ('Employee', 'Employee'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Employee')
    phone = models.CharField(max_length=15, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    lockout_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.role})"


# Department Model
class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=100, unique=True)
    department_head = models.CharField(max_length=100)
    employees_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['department_name']
        verbose_name_plural = 'Departments'

    def __str__(self):
        return self.department_name


# Employee Model
class Employee(models.Model):
    employee_id = models.CharField(max_length=10, unique=True, primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile', null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    designation = models.CharField(max_length=100)
    joining_date = models.DateField()
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    emergency_contacts = models.TextField(blank=True, default='[]')
    skills_tracking = models.TextField(blank=True, default='[]')
    certifications = models.TextField(blank=True, default='[]')
    assigned_assets = models.TextField(blank=True, default='[]')
    documents = models.TextField(blank=True, default='[]')
    history = models.TextField(blank=True, default='[]')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['employee_id']
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.employee_id} - {self.name}"


# Attendance Model
class Attendance(models.Model):
    STATUS_CHOICES = (
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Leave', 'Leave'),
        ('Late', 'Late'),
    )

    attendance_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Absent')
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('employee', 'date')
        verbose_name_plural = 'Attendance'

    def __str__(self):
        return f"{self.employee.name} - {self.date} - {self.status}"


# Leave Request Model
class LeaveRequest(models.Model):
    LEAVE_TYPE_CHOICES = (
        ('Casual Leave', 'Casual Leave'),
        ('Sick Leave', 'Sick Leave'),
        ('Earned Leave', 'Earned Leave'),
        ('Maternity Leave', 'Maternity Leave'),
    )
    
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Cancelled', 'Cancelled'),
    )

    leave_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    applied_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.employee.name} - {self.leave_type} ({self.status})"


# Leave Balance Model
class LeaveBalance(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='leave_balance', primary_key=True)
    casual_leave = models.IntegerField(default=12, validators=[MinValueValidator(0), MaxValueValidator(365)])
    sick_leave = models.IntegerField(default=8, validators=[MinValueValidator(0), MaxValueValidator(365)])
    earned_leave = models.IntegerField(default=20, validators=[MinValueValidator(0), MaxValueValidator(365)])
    year = models.IntegerField(default=date.today().year)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('employee', 'year')

    def __str__(self):
        return f"{self.employee.name} - Leave Balance {self.year}"


# Job Opening Model
class JobOpening(models.Model):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Closed', 'Closed'),
        ('On Hold', 'On Hold'),
    )

    job_id = models.AutoField(primary_key=True)
    position = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    description = models.TextField()
    posted_date = models.DateField(auto_now_add=True)
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-posted_date']

    def __str__(self):
        return f"{self.position} - {self.status}"


# Candidate Model
class Candidate(models.Model):
    CANDIDATE_STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Shortlisted', 'Shortlisted'),
        ('Interview Scheduled', 'Interview Scheduled'),
        ('Interview Completed', 'Interview Completed'),
        ('Selected', 'Selected'),
        ('Rejected', 'Rejected'),
        ('On Hold', 'On Hold'),
    )

    candidate_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    job_opening = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name='candidates')
    status = models.CharField(max_length=30, choices=CANDIDATE_STATUS_CHOICES, default='Applied')
    applied_date = models.DateTimeField(auto_now_add=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_remarks = models.TextField(blank=True)
    rating = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.name} - {self.job_opening.position} ({self.status})"


# Payroll Model
class Payroll(models.Model):
    salary_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payroll_records')
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.CharField(max_length=20)  # Format: "June 2026"
    year = models.IntegerField()
    payslip_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('employee', 'month', 'year')

    def save(self, *args, **kwargs):
        self.net_salary = self.basic_salary + self.allowances + self.bonus - self.deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.name} - {self.month} - ₹{self.net_salary}"


# Announcement Model
class Announcement(models.Model):
    announcement_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    announcement_type = models.CharField(max_length=50, default='general')
    posted_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-posted_date']

    def __str__(self):
        return self.title


# Audit Log Model
class AuditLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    ip_address = models.CharField(max_length=45, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        user_str = self.user.username if self.user else "Anonymous"
        return f"{user_str} - {self.action} at {self.timestamp}"


# Holiday Model
class Holiday(models.Model):
    holiday_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    date = models.DateField(unique=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.title} - {self.date}"
