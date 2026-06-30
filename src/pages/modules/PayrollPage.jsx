import React, { useState, useMemo } from 'react';
import { useHRData } from '../../context/HRDataContext';

const PayrollPage = () => {
  const { payroll, employees } = useHRData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const enrichedPayroll = useMemo(() => {
    return payroll.map(p => {
      const emp = employees.find(e => e.employee_id === p.employee_id);
      const taxRate = 0.1;
      const taxAmount = parseFloat(p.basic_salary || 0) * taxRate;
      return {
        ...p,
        employee_name: emp?.name || p.employee_id,
        tax_amount: taxAmount.toFixed(2),
        gross_salary: (parseFloat(p.basic_salary || 0) + parseFloat(p.allowances || 0) + parseFloat(p.bonus || 0)).toFixed(2),
      };
    });
  }, [payroll, employees]);

  const filtered = useMemo(() => {
    return enrichedPayroll.filter(p => {
      const matchSearch = p.employee_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMonth = !filterMonth || p.month === filterMonth;
      return matchSearch && matchMonth;
    });
  }, [enrichedPayroll, searchTerm, filterMonth]);

  const totalPayroll = filtered.reduce((sum, p) => sum + parseFloat(p.net_salary || 0), 0);
  const totalTax = filtered.reduce((sum, p) => sum + parseFloat(p.tax_amount || 0), 0);

  const uniqueMonths = [...new Set(payroll.map(p => p.month))];

  const generatePayslip = (record) => {
    const slipWindow = window.open('', '_blank', 'width=800,height=700');
    slipWindow.document.write(`
      <html><head><title>Payslip - ${record.employee_name}</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:40px;background:#fafafa;color:#333;}
        .slip{max-width:650px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:12px;overflow:hidden;}
        .header{background:linear-gradient(135deg,#4f46e5,#06b6d4);color:#fff;padding:30px;text-align:center;}
        .header h1{margin:0;font-size:1.5rem;} .header p{margin:5px 0 0;opacity:0.8;font-size:0.9rem;}
        .body{padding:30px;}
        table{width:100%;border-collapse:collapse;margin-top:15px;}
        td{padding:8px 12px;border-bottom:1px solid #eee;font-size:0.9rem;}
        td:first-child{color:#666;width:45%;} td:last-child{text-align:right;font-weight:600;}
        .total{background:#f0f9ff;font-weight:700;font-size:1rem;}
        .footer{text-align:center;padding:20px;color:#999;font-size:0.8rem;border-top:1px solid #eee;}
      </style></head>
      <body><div class="slip">
        <div class="header"><h1>💼 HR Management Portal</h1><p>Salary Payslip — ${record.month} ${record.year}</p></div>
        <div class="body">
          <table>
            <tr><td>Employee Name</td><td>${record.employee_name}</td></tr>
            <tr><td>Employee ID</td><td>${record.employee_id}</td></tr>
            <tr><td>Pay Period</td><td>${record.month} ${record.year}</td></tr>
          </table>
          <h6 style="margin-top:25px;color:#4f46e5;">Earnings</h6>
          <table>
            <tr><td>Basic Salary</td><td>₹${parseFloat(record.basic_salary).toLocaleString()}</td></tr>
            <tr><td>Allowances (HRA + DA)</td><td>₹${parseFloat(record.allowances).toLocaleString()}</td></tr>
            <tr><td>Bonus</td><td>₹${parseFloat(record.bonus || 0).toLocaleString()}</td></tr>
            <tr class="total"><td>Gross Salary</td><td>₹${parseFloat(record.gross_salary).toLocaleString()}</td></tr>
          </table>
          <h6 style="margin-top:25px;color:#dc3545;">Deductions</h6>
          <table>
            <tr><td>Tax (10%)</td><td>₹${parseFloat(record.tax_amount).toLocaleString()}</td></tr>
            <tr><td>Other Deductions</td><td>₹${parseFloat(record.deductions || 0).toLocaleString()}</td></tr>
            <tr class="total"><td>Total Deductions</td><td>₹${(parseFloat(record.tax_amount) + parseFloat(record.deductions || 0)).toLocaleString()}</td></tr>
          </table>
          <table style="margin-top:20px;">
            <tr class="total" style="background:#e8f5e9;"><td>Net Salary</td><td style="color:#2e7d32;font-size:1.2rem;">₹${parseFloat(record.net_salary).toLocaleString()}</td></tr>
          </table>
        </div>
        <div class="footer">This is a system-generated payslip. For queries, contact HR.<br/>Generated on ${new Date().toLocaleDateString()}</div>
      </div><script>setTimeout(()=>window.print(),500)</script></body></html>
    `);
  };

  const exportCSV = () => {
    const headers = ['Employee ID', 'Employee', 'Month', 'Basic', 'Allowances', 'Bonus', 'Deductions', 'Tax', 'Net Salary'];
    const rows = filtered.map(p => [p.employee_id, p.employee_name, `${p.month} ${p.year}`, p.basic_salary, p.allowances, p.bonus, p.deductions, p.tax_amount, p.net_salary]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'payroll_report.csv'; a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Payroll Management</h1>
          <button className="btn btn-outline-success" onClick={exportCSV}>📊 Export CSV</button>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Total Records</p>
              <h2 className="fw-bold text-primary">{filtered.length}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Total Payroll</p>
              <h2 className="fw-bold text-success">₹{totalPayroll.toLocaleString()}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Total Tax</p>
              <h2 className="fw-bold text-danger">₹{totalTax.toLocaleString()}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Avg Net Salary</p>
              <h2 className="fw-bold text-info">₹{filtered.length ? Math.round(totalPayroll / filtered.length).toLocaleString() : 0}</h2>
            </div></div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="🔍 Search employee..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="col-md-6">
            <select className="form-select" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option value="">All Months</option>
              {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Employee</th><th>Month</th><th>Basic</th><th>Allowances</th><th>Bonus</th><th>Tax (10%)</th><th>Deductions</th><th>Net Salary</th><th>Payslip</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.salary_id}>
                    <td className="fw-500">{p.employee_name}</td>
                    <td>{p.month} {p.year}</td>
                    <td>₹{parseFloat(p.basic_salary).toLocaleString()}</td>
                    <td>₹{parseFloat(p.allowances).toLocaleString()}</td>
                    <td>₹{parseFloat(p.bonus || 0).toLocaleString()}</td>
                    <td className="text-danger">₹{parseFloat(p.tax_amount).toLocaleString()}</td>
                    <td>₹{parseFloat(p.deductions || 0).toLocaleString()}</td>
                    <td className="fw-bold text-success">₹{parseFloat(p.net_salary).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => generatePayslip(p)}>
                        📄 Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>💰</div>
            <h5 className="text-muted mt-2">No payroll records found</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;
