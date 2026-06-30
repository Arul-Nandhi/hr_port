from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, DepartmentViewSet, EmployeeViewSet, AttendanceViewSet,
    LeaveRequestViewSet, LeaveBalanceViewSet, JobOpeningViewSet, CandidateViewSet,
    PayrollViewSet, AnnouncementViewSet, DashboardViewSet, AuditLogViewSet, HolidayViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'leave-balance', LeaveBalanceViewSet, basename='leave-balance')
router.register(r'job-openings', JobOpeningViewSet, basename='job-opening')
router.register(r'candidates', CandidateViewSet, basename='candidate')
router.register(r'payroll', PayrollViewSet, basename='payroll')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-log')
router.register(r'holidays', HolidayViewSet, basename='holiday')

urlpatterns = [
    path('', include(router.urls)),
]
