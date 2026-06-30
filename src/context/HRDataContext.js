import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const HRDataContext = createContext();

export const HRDataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all data from Django backend when authenticated
  useEffect(() => {
    const fetchAllData = async () => {
      if (!isAuthenticated) {
        // Clear state if logged out
        setEmployees([]);
        setDepartments([]);
        setAttendance([]);
        setLeaveRequests([]);
        setLeaveBalance([]);
        setJobOpenings([]);
        setCandidates([]);
        setPayroll([]);
        setAnnouncements([]);
        return;
      }

      setLoading(true);
      try {
        const [
          empRes,
          deptRes,
          attRes,
          leaveReqRes,
          leaveBalRes,
          jobsRes,
          candRes,
          payRes,
          annRes,
        ] = await Promise.all([
          api.get('employees/'),
          api.get('departments/'),
          api.get('attendance/'),
          api.get('leave-requests/'),
          api.get('leave-balance/'),
          api.get('job-openings/'),
          api.get('candidates/'),
          api.get('payroll/'),
          api.get('announcements/'),
        ]);

        // Helper to extract list from pagination wrapper
        const extractList = (res) => res.data.results || res.data;

        setEmployees(extractList(empRes));
        setDepartments(extractList(deptRes));
        setAttendance(extractList(attRes));
        setLeaveRequests(extractList(leaveReqRes));
        setLeaveBalance(extractList(leaveBalRes));
        setJobOpenings(extractList(jobsRes));
        setCandidates(extractList(candRes));
        setPayroll(extractList(payRes));
        setAnnouncements(extractList(annRes));
      } catch (error) {
        console.error('Error fetching HR data from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isAuthenticated]);

  // Employee Management
  const addEmployee = async (employeeData) => {
    try {
      const payload = {
        ...employeeData,
        department: employeeData.department_id,
        is_active: true,
      };
      delete payload.department_id;

      const response = await api.post('employees/', payload);
      const newEmp = response.data;
      setEmployees((prev) => [...prev, newEmp]);
      return newEmp;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  };

  const updateEmployee = async (employeeId, updates) => {
    try {
      const payload = { ...updates };
      if (updates.department_id) {
        payload.department = updates.department_id;
        delete payload.department_id;
      }
      
      const response = await api.patch(`employees/${employeeId}/`, payload);
      const updatedEmp = response.data;
      setEmployees((prev) =>
        prev.map((emp) => (emp.employee_id === employeeId ? updatedEmp : emp))
      );
      return updatedEmp;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await api.delete(`employees/${employeeId}/`);
      setEmployees((prev) => prev.filter((emp) => emp.employee_id !== employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  };

  const getEmployeeById = (employeeId) => {
    return employees.find((emp) => emp.employee_id === employeeId);
  };

  // Attendance Management
  const recordAttendance = async (employeeId, date, checkIn, checkOut) => {
    try {
      const payload = {
        employee_id: employeeId,
        check_in: checkIn,
        check_out: checkOut,
        status: checkIn ? 'Present' : 'Absent',
      };
      
      const response = await api.post('attendance/mark_attendance/', payload);
      const newAtt = response.data;

      setAttendance((prev) => {
        const index = prev.findIndex(
          (att) => att.employee_id === employeeId && att.date === newAtt.date
        );
        if (index > -1) {
          const updated = [...prev];
          updated[index] = newAtt;
          return updated;
        }
        return [...prev, newAtt];
      });

      return newAtt;
    } catch (error) {
      console.error('Error recording attendance:', error);
      throw error;
    }
  };

  // Leave Management
  const applyLeave = async (leaveData) => {
    try {
      const payload = {
        ...leaveData,
        employee_id: leaveData.employee_id || leaveData.employee,
      };
      const response = await api.post('leave-requests/', payload);
      const newLeave = response.data;
      setLeaveRequests((prev) => [...prev, newLeave]);
      return newLeave;
    } catch (error) {
      console.error('Error applying for leave:', error);
      throw error;
    }
  };

  const approveLeave = async (leaveId) => {
    try {
      const response = await api.post(`leave-requests/${leaveId}/approve/`);
      const updatedLeave = response.data;
      setLeaveRequests((prev) =>
        prev.map((leave) => (leave.leave_id === leaveId ? updatedLeave : leave))
      );
      return updatedLeave;
    } catch (error) {
      console.error('Error approving leave:', error);
      throw error;
    }
  };

  const rejectLeave = async (leaveId) => {
    try {
      const response = await api.post(`leave-requests/${leaveId}/reject/`);
      const updatedLeave = response.data;
      setLeaveRequests((prev) =>
        prev.map((leave) => (leave.leave_id === leaveId ? updatedLeave : leave))
      );
      return updatedLeave;
    } catch (error) {
      console.error('Error rejecting leave:', error);
      throw error;
    }
  };

  // Candidate Management
  const addCandidate = async (candidateData) => {
    try {
      const response = await api.post('candidates/', candidateData);
      const newCand = response.data;
      setCandidates((prev) => [...prev, newCand]);
      return newCand;
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  };

  const updateCandidateStatus = async (candidateId, status) => {
    try {
      const response = await api.post(`candidates/${candidateId}/update_status/`, { status });
      const updatedCand = response.data;
      setCandidates((prev) =>
        prev.map((cand) => (cand.candidate_id === candidateId ? updatedCand : cand))
      );
      return updatedCand;
    } catch (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }
  };

  // Alias for AttendancePage compatibility
  const markAttendance = async (formData) => {
    try {
      const payload = {
        employee_id: formData.employee_id,
        check_in: formData.check_in,
        check_out: formData.check_out,
        status: formData.status || 'Present',
      };
      const response = await api.post('attendance/mark_attendance/', payload);
      const newAtt = response.data;
      setAttendance((prev) => {
        const index = prev.findIndex(
          (att) => att.employee_id === formData.employee_id && att.date === newAtt.date
        );
        if (index > -1) {
          const updated = [...prev];
          updated[index] = newAtt;
          return updated;
        }
        return [...prev, newAtt];
      });
      return newAtt;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  };

  // Dashboard Stats (Computed synchronously from sync'd local states)
  const getDashboardStats = () => {
    const activeEmp = employees.filter((emp) => emp.is_active).length;
    const pendingL = leaveRequests.filter((l) => l.status === 'Pending').length;
    const openJ = jobOpenings.filter((j) => j.status === 'Open').length;

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmp,
      departmentsCount: departments.length,
      pendingLeaves: pendingL,
      openJobs: openJ,
    };
  };

  return (
    <HRDataContext.Provider
      value={{
        employees,
        departments,
        attendance,
        leaveRequests,
        leaveBalance,
        jobOpenings,
        candidates,
        payroll,
        announcements,
        loading,

        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
        recordAttendance,
        applyLeave,
        approveLeave,
        rejectLeave,
        addCandidate,
        updateCandidateStatus,
        getDashboardStats,
        markAttendance,
      }}
    >
      {children}
    </HRDataContext.Provider>
  );
};

export const useHRData = () => {
  const context = useContext(HRDataContext);
  if (!context) {
    throw new Error('useHRData must be used within HRDataProvider');
  }
  return context;
};
