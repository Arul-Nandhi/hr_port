from django.contrib import admin
from .models import (
    User, Department, Employee, Attendance, LeaveRequest, LeaveBalance,
    JobOpening, Candidate, Payroll, Announcement
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_staff', 'created_at']
    list_filter = ['role', 'is_staff', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['department_name', 'department_head', 'employees_count']
    search_fields = ['department_name']


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'name', 'email', 'department', 'designation', 'is_active']
    list_filter = ['department', 'is_active', 'joining_date']
    search_fields = ['employee_id', 'name', 'email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'check_in', 'check_out', 'status']
    list_filter = ['date', 'status']
    search_fields = ['employee__name']
    readonly_fields = ['created_at']


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'leave_type', 'applied_date']
    search_fields = ['employee__name']
    readonly_fields = ['applied_date', 'updated_at']


@admin.register(LeaveBalance)
class LeaveBalanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'casual_leave', 'sick_leave', 'earned_leave', 'year']
    list_filter = ['year']
    search_fields = ['employee__name']


@admin.register(JobOpening)
class JobOpeningAdmin(admin.ModelAdmin):
    list_display = ['position', 'department', 'status', 'posted_date', 'deadline']
    list_filter = ['status', 'posted_date']
    search_fields = ['position']


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'job_opening', 'status', 'applied_date', 'rating']
    list_filter = ['status', 'applied_date']
    search_fields = ['name', 'email']
    readonly_fields = ['applied_date', 'created_at', 'updated_at']


@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ['employee', 'month', 'year', 'basic_salary', 'net_salary']
    list_filter = ['month', 'year']
    search_fields = ['employee__name', 'employee__employee_id']
    readonly_fields = ['net_salary', 'created_at']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'announcement_type', 'posted_date', 'is_active']
    list_filter = ['announcement_type', 'posted_date', 'is_active']
    search_fields = ['title', 'content']
    readonly_fields = ['posted_date']
