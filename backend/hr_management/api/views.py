from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta, date
from django.db.models import Q, Count
from django.contrib.auth import get_user_model

from .models import (
    Department, Employee, Attendance, LeaveRequest, LeaveBalance,
    JobOpening, Candidate, Payroll, Announcement, AuditLog, Holiday
)
from .serializers import (
    UserSerializer, UserDetailSerializer, UserLoginSerializer,
    DepartmentSerializer, EmployeeListSerializer, EmployeeDetailSerializer,
    AttendanceSerializer, LeaveRequestSerializer, LeaveBalanceSerializer,
    JobOpeningSerializer, CandidateListSerializer, CandidateDetailSerializer,
    PayrollSerializer, AnnouncementSerializer, DashboardStatsSerializer,
    AuditLogSerializer, HolidaySerializer
)

User = get_user_model()


# ============================================================
# Authentication ViewSets
# ============================================================

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """User login endpoint"""
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username_or_email = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # Try to find the user by email first if it looks like an email
        username = username_or_email
        user_obj = None
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                username = user_obj.username
            except User.DoesNotExist:
                pass
        else:
            try:
                user_obj = User.objects.get(username=username_or_email)
            except User.DoesNotExist:
                pass

        ip_addr = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
        if ',' in ip_addr:
            ip_addr = ip_addr.split(',')[0].strip()

        # Check for lockout status
        if user_obj:
            if user_obj.lockout_until and user_obj.lockout_until > timezone.now():
                AuditLog.objects.create(
                    user=user_obj,
                    action="Login blocked (Account Locked)",
                    ip_address=ip_addr
                )
                return Response({
                    'error': f'Account locked due to 5 failed login attempts. Locked until {user_obj.lockout_until.strftime("%H:%M:%S")}'
                }, status=status.HTTP_403_FORBIDDEN)
        
        user = authenticate(
            username=username,
            password=password
        )
        
        if user is None:
            if user_obj:
                user_obj.failed_login_attempts += 1
                if user_obj.failed_login_attempts >= 5:
                    user_obj.lockout_until = timezone.now() + timedelta(minutes=15)
                    action_msg = "Account locked after 5 failed login attempts"
                else:
                    action_msg = f"Failed login attempt {user_obj.failed_login_attempts}/5"
                user_obj.save()
                
                AuditLog.objects.create(
                    user=user_obj,
                    action=action_msg,
                    ip_address=ip_addr
                )
            else:
                AuditLog.objects.create(
                    user=None,
                    action=f"Failed login attempt for non-existent username: {username_or_email}",
                    ip_address=ip_addr
                )

            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if user.role not in ['Admin', 'HR']:
            AuditLog.objects.create(
                user=user,
                action="Login rejected (Access Denied - role mismatch)",
                ip_address=ip_addr
            )
            return Response({'error': 'Access denied. Only HR Managers and Admins can access this portal.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Reset counters on success
        user.failed_login_attempts = 0
        user.lockout_until = None
        user.save()

        AuditLog.objects.create(
            user=user,
            action="Logged in successfully",
            ip_address=ip_addr
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserDetailSerializer(user).data
        })


    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """User registration endpoint"""
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'HR')
        phone = request.data.get('phone', '')

        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Normalize role input
        if role == 'HR Manager':
            role = 'HR'

        if role not in ['Admin', 'HR']:
            return Response({'error': 'Access denied. You can only register as HR or Admin.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            phone=phone
        )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserDetailSerializer(user).data
        }, status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['post'])
    def logout(self, request):
        """User logout endpoint"""
        return Response({'message': 'Logged out successfully'})

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info"""
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response(
                {'error': 'Both old_password and new_password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not request.user.check_password(old_password):
            return Response(
                {'error': 'Old password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.user.set_password(new_password)
        request.user.save()
        return Response({'message': 'Password changed successfully'})


# ============================================================
# Department ViewSets
# ============================================================

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['department_name', 'department_head']
    ordering_fields = ['department_name', 'employees_count']

    @action(detail=True, methods=['get'])
    def employees(self, request, pk=None):
        """Get all employees in a department"""
        department = self.get_object()
        employees = Employee.objects.filter(department=department)
        serializer = EmployeeListSerializer(employees, many=True)
        return Response(serializer.data)


# ============================================================
# Employee ViewSets
# ============================================================

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee_id', 'name', 'email', 'designation']
    ordering_fields = ['employee_id', 'name', 'joining_date']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EmployeeDetailSerializer
        return EmployeeListSerializer

    def get_queryset(self):
        queryset = Employee.objects.all()
        department_id = self.request.query_params.get('department')
        is_active = self.request.query_params.get('is_active')
        
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if is_active:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active employees"""
        employees = Employee.objects.filter(is_active=True)
        serializer = EmployeeListSerializer(employees, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def attendance_summary(self, request, pk=None):
        """Get attendance summary for an employee"""
        employee = self.get_object()
        today = date.today()
        month_start = today.replace(day=1)
        
        attendance_records = Attendance.objects.filter(
            employee=employee,
            date__gte=month_start
        )
        
        present_count = attendance_records.filter(status='Present').count()
        absent_count = attendance_records.filter(status='Absent').count()
        leave_count = attendance_records.filter(status='Leave').count()
        
        return Response({
            'employee_id': employee.employee_id,
            'name': employee.name,
            'month': today.strftime('%B %Y'),
            'present': present_count,
            'absent': absent_count,
            'leave': leave_count,
            'total': attendance_records.count()
        })


# ============================================================
# Attendance ViewSets
# ============================================================

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__name', 'employee__employee_id', 'status']
    ordering_fields = ['date', 'status']

    def get_queryset(self):
        queryset = Attendance.objects.all()
        date_filter = self.request.query_params.get('date')
        employee_id = self.request.query_params.get('employee_id')
        status_filter = self.request.query_params.get('status')
        
        if date_filter:
            queryset = queryset.filter(date=date_filter)
        if employee_id:
            queryset = queryset.filter(employee__employee_id=employee_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's attendance"""
        today = date.today()
        attendance_records = Attendance.objects.filter(date=today)
        serializer = AttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_attendance(self, request):
        """Mark attendance for an employee"""
        employee_id = request.data.get('employee_id')
        check_in = request.data.get('check_in')
        check_out = request.data.get('check_out')
        status = request.data.get('status', 'Present')
        
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
        
        today = date.today()
        attendance, created = Attendance.objects.update_or_create(
            employee=employee,
            date=today,
            defaults={
                'check_in': check_in,
                'check_out': check_out,
                'status': status
            }
        )
        
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


# ============================================================
# Leave ViewSets
# ============================================================

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__name', 'leave_type', 'status']
    ordering_fields = ['applied_date', 'status']

    def get_queryset(self):
        queryset = LeaveRequest.objects.all()
        status_filter = self.request.query_params.get('status')
        employee_id = self.request.query_params.get('employee_id')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if employee_id:
            queryset = queryset.filter(employee__employee_id=employee_id)
        
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a leave request"""
        employee_id = request.data.get('employee_id')
        
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
        
        request.data['employee'] = employee.employee_id
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request"""
        leave = self.get_object()
        leave.status = 'Approved'
        leave.approved_by = request.user
        leave.save()
        serializer = LeaveRequestSerializer(leave)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request"""
        leave = self.get_object()
        leave.status = 'Rejected'
        leave.approved_by = request.user
        leave.save()
        serializer = LeaveRequestSerializer(leave)
        return Response(serializer.data)


class LeaveBalanceViewSet(viewsets.ModelViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def by_employee(self, request):
        """Get leave balance by employee ID"""
        employee_id = request.query_params.get('employee_id')
        if not employee_id:
            return Response({'error': 'employee_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            leave_balance = LeaveBalance.objects.get(employee__employee_id=employee_id)
            serializer = LeaveBalanceSerializer(leave_balance)
            return Response(serializer.data)
        except LeaveBalance.DoesNotExist:
            return Response({'error': 'Leave balance not found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================================
# Recruitment ViewSets
# ============================================================

class JobOpeningViewSet(viewsets.ModelViewSet):
    queryset = JobOpening.objects.all()
    serializer_class = JobOpeningSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['position', 'department__department_name']
    ordering_fields = ['posted_date', 'status']

    def get_queryset(self):
        queryset = JobOpening.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @action(detail=True, methods=['get'])
    def candidates(self, request, pk=None):
        """Get all candidates for a job opening"""
        job = self.get_object()
        candidates = Candidate.objects.filter(job_opening=job)
        serializer = CandidateListSerializer(candidates, many=True)
        return Response(serializer.data)


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'job_opening__position']
    ordering_fields = ['applied_date', 'status', 'rating']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CandidateDetailSerializer
        return CandidateListSerializer

    def get_queryset(self):
        queryset = Candidate.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update candidate status"""
        candidate = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Candidate._meta.get_field('status').choices):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        candidate.status = new_status
        candidate.save()
        serializer = CandidateDetailSerializer(candidate)
        return Response(serializer.data)


# ============================================================
# Payroll ViewSets
# ============================================================

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__name', 'employee__employee_id', 'month']
    ordering_fields = ['created_at', 'net_salary']

    def get_queryset(self):
        queryset = Payroll.objects.all()
        employee_id = self.request.query_params.get('employee_id')
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        
        if employee_id:
            queryset = queryset.filter(employee__employee_id=employee_id)
        if month:
            queryset = queryset.filter(month=month)
        if year:
            queryset = queryset.filter(year=year)
        
        return queryset

    @action(detail=False, methods=['get'])
    def by_employee(self, request):
        """Get payroll records by employee ID"""
        employee_id = request.query_params.get('employee_id')
        if not employee_id:
            return Response({'error': 'employee_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        payroll_records = Payroll.objects.filter(employee__employee_id=employee_id)
        serializer = PayrollSerializer(payroll_records, many=True)
        return Response(serializer.data)


# ============================================================
# Announcement ViewSets
# ============================================================

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.filter(is_active=True)
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'announcement_type']
    ordering_fields = ['posted_date']


# ============================================================
# Dashboard ViewSet
# ============================================================

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get dashboard statistics"""
        today = date.today()
        
        total_employees = Employee.objects.count()
        active_employees = Employee.objects.filter(is_active=True).count()
        departments_count = Department.objects.count()
        pending_leaves = LeaveRequest.objects.filter(status='Pending').count()
        open_jobs = JobOpening.objects.filter(status='Open').count()
        present_today = Attendance.objects.filter(date=today, status='Present').count()
        
        stats = {
            'total_employees': total_employees,
            'active_employees': active_employees,
            'departments_count': departments_count,
            'pending_leaves': pending_leaves,
            'open_jobs': open_jobs,
            'present_today': present_today
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'action', 'ip_address']


class HolidayViewSet(viewsets.ModelViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date']
