import json
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Department, Employee, Attendance, LeaveRequest, LeaveBalance,
    JobOpening, Candidate, Payroll, Announcement, AuditLog, Holiday
)

User = get_user_model()


# ============================================================
# Authentication Serializers
# ============================================================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserDetailSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'employee_id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_employee_id(self, obj):
        if hasattr(obj, 'employee_profile') and obj.employee_profile:
            return obj.employee_profile.employee_id
        return None

    def get_name(self, obj):
        if hasattr(obj, 'employee_profile') and obj.employee_profile:
            return obj.employee_profile.name
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username



class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


# ============================================================
# Department Serializers
# ============================================================

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['department_id', 'department_name', 'department_head', 'employees_count', 'created_at', 'updated_at']
        read_only_fields = ['department_id', 'created_at', 'updated_at']


# ============================================================
# Employee Serializers
# ============================================================

class EmployeeListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = Employee
        fields = ['employee_id', 'name', 'email', 'phone', 'department', 'department_name', 
                  'designation', 'joining_date', 'is_active']
        read_only_fields = ['employee_id']


class EmployeeDetailSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    
    emergency_contacts = serializers.SerializerMethodField()
    skills_tracking = serializers.SerializerMethodField()
    certifications = serializers.SerializerMethodField()
    assigned_assets = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['employee_id', 'name', 'email', 'phone', 'department', 'department_name', 
                  'designation', 'joining_date', 'address', 'is_active', 'user_details',
                  'emergency_contacts', 'skills_tracking', 'certifications', 'assigned_assets', 
                  'documents', 'history', 'created_at', 'updated_at']
        read_only_fields = ['employee_id', 'created_at', 'updated_at']

    def get_emergency_contacts(self, obj):
        try:
            return json.loads(obj.emergency_contacts or '[]')
        except:
            return []

    def get_skills_tracking(self, obj):
        try:
            return json.loads(obj.skills_tracking or '[]')
        except:
            return []

    def get_certifications(self, obj):
        try:
            return json.loads(obj.certifications or '[]')
        except:
            return []

    def get_assigned_assets(self, obj):
        try:
            return json.loads(obj.assigned_assets or '[]')
        except:
            return []

    def get_documents(self, obj):
        try:
            return json.loads(obj.documents or '[]')
        except:
            return []

    def get_history(self, obj):
        try:
            return json.loads(obj.history or '[]')
        except:
            return []

    def to_internal_value(self, data):
        # Convert list/object structures to json text
        for field in ['emergency_contacts', 'skills_tracking', 'certifications', 'assigned_assets', 'documents', 'history']:
            if field in data and not isinstance(data[field], str):
                data[field] = json.dumps(data[field])
        return super().to_internal_value(data)


# ============================================================
# Attendance Serializers
# ============================================================

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['attendance_id', 'employee', 'employee_id', 'employee_name', 'date', 
                  'check_in', 'check_out', 'status', 'remarks', 'created_at']
        read_only_fields = ['attendance_id', 'created_at']


# ============================================================
# Leave Serializers
# ============================================================

class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = LeaveBalance
        fields = ['employee', 'employee_id', 'employee_name', 'casual_leave', 
                  'sick_leave', 'earned_leave', 'year', 'updated_at']
        read_only_fields = ['employee', 'year', 'updated_at']


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = ['leave_id', 'employee', 'employee_name', 'leave_type', 'start_date', 
                  'end_date', 'reason', 'status', 'approved_by', 'approved_by_name', 
                  'applied_date', 'updated_at']
        read_only_fields = ['leave_id', 'applied_date', 'updated_at', 'approved_by']


# ============================================================
# Recruitment Serializers
# ============================================================

class JobOpeningSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = JobOpening
        fields = ['job_id', 'position', 'department', 'department_name', 'description', 
                  'posted_date', 'deadline', 'status', 'created_by', 'created_by_name']
        read_only_fields = ['job_id', 'posted_date']


class CandidateListSerializer(serializers.ModelSerializer):
    job_position = serializers.CharField(source='job_opening.position', read_only=True)
    
    class Meta:
        model = Candidate
        fields = ['candidate_id', 'name', 'email', 'phone', 'job_opening', 'job_position', 
                  'status', 'applied_date', 'rating']
        read_only_fields = ['candidate_id', 'applied_date']


class CandidateDetailSerializer(serializers.ModelSerializer):
    job_position = serializers.CharField(source='job_opening.position', read_only=True)
    
    class Meta:
        model = Candidate
        fields = ['candidate_id', 'name', 'email', 'phone', 'resume', 'job_opening', 
                  'job_position', 'status', 'applied_date', 'interview_date', 
                  'interview_remarks', 'rating', 'created_at', 'updated_at']
        read_only_fields = ['candidate_id', 'applied_date', 'created_at', 'updated_at']


# ============================================================
# Payroll Serializers
# ============================================================

class PayrollSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = Payroll
        fields = ['salary_id', 'employee', 'employee_id', 'employee_name', 'basic_salary', 
                  'allowances', 'deductions', 'bonus', 'net_salary', 'month', 'year', 
                  'payslip_generated', 'created_at']
        read_only_fields = ['salary_id', 'net_salary', 'created_at']


# ============================================================
# Announcement Serializers
# ============================================================

class AnnouncementSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.CharField(source='posted_by.get_full_name', read_only=True)
    
    class Meta:
        model = Announcement
        fields = ['announcement_id', 'title', 'content', 'posted_by', 'posted_by_name', 
                  'announcement_type', 'posted_date', 'is_active']
        read_only_fields = ['announcement_id', 'posted_date']


# ============================================================
# Dashboard Serializers
# ============================================================

class DashboardStatsSerializer(serializers.Serializer):
    total_employees = serializers.IntegerField()
    active_employees = serializers.IntegerField()
    departments_count = serializers.IntegerField()
    pending_leaves = serializers.IntegerField()
    open_jobs = serializers.IntegerField()
    present_today = serializers.IntegerField()


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AuditLog
        fields = ['log_id', 'user', 'username', 'action', 'ip_address', 'timestamp']
        read_only_fields = ['log_id', 'timestamp']


class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = ['holiday_id', 'title', 'date', 'is_public']
        read_only_fields = ['holiday_id']
