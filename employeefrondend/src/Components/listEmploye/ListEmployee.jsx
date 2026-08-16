import React, { useEffect, useState } from 'react'
import "./ListEmployee.css"
import { useNavigate } from 'react-router-dom'
import EmployeeService from '../../service/EmployeeService';
import AuthService from '../../service/AuthService';
import { notifyUnauthorized } from '../../service/notify';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatSalary(salary) {
  if (salary === null || salary === undefined || salary === '') return '\u2014';
  return currencyFormatter.format(salary);
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const ListEmployeeComponent = () => {

  const [employeeArray, setEmployeeArray] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAdmin = AuthService.isAdmin();

  useEffect(() => {
    getAllEmployee();
  }, []);

  function getAllEmployee() {
    EmployeeService.getAllEmployee()
      .then(res => { setEmployeeArray(res.data); setError(''); })
      .catch(e => {
        console.log(e);
        setError(e.response?.data?.error || "Could not load employees. Please check the backend is running.");
      });
  }

  function handleAddClick(e) {
    if (!isAdmin) {
      e.preventDefault();
      notifyUnauthorized("Adding employees requires administrator access.");
      return;
    }
    navigate("/add-employee");
  }

  function handleUpdateClick(e, id) {
    e.preventDefault();
    if (!isAdmin) {
      notifyUnauthorized("Updating employees requires administrator access.");
      return;
    }
    navigate(`/add-employee/${id}`);
  }

  function deleteEmployee(e, id) {
    e.preventDefault();
    if (!isAdmin) {
      notifyUnauthorized("Deleting employees requires administrator access.");
      return;
    }
    EmployeeService.deleteEmployee(id).then(() => { getAllEmployee() })
      .catch(e => {
        console.log(e);
        setError(e.response?.data?.error || "Could not delete employee.");
      });
  }

  return (
    <div className='container'>
      <div className="page-heading">
        <div>
          <h2 className='text'>Employee Directory</h2>
          <p className="page-subtitle">
            {isAdmin
              ? "You have full access \u2014 add, update, and remove employee records."
              : "You have read-only access. Contact an administrator to make changes."}
          </p>
        </div>
        {isAdmin && (
          <button className='btn' onClick={handleAddClick}>+ Add Employee</button>
        )}
      </div>

      {error && <p className="list-error">{error}</p>}

      <div className="table-wrap">
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Hire Date</th>
              <th>Managed By</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employeeArray.length === 0 && !error && (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="empty-row">No employees yet.</td>
              </tr>
            )}
            {employeeArray.map(employee =>
              <tr key={employee.id}>
                <td className="cell-id">{employee.id}</td>
                <td className="cell-name">{employee.firstname} {employee.lastname}</td>
                <td>{employee.email}</td>
                <td>{employee.department || '\u2014'}</td>
                <td>{employee.position || '\u2014'}</td>
                <td className="cell-mono">{formatSalary(employee.salary)}</td>
                <td>{formatDate(employee.hireDate)}</td>
                <td>
                  {employee.managedByUsername
                    ? <span className="managed-by-pill">{employee.managedByUsername}</span>
                    : <span className="managed-by-pill managed-by-pill--empty">{'\u2014'}</span>}
                </td>
                {isAdmin && (
                  <td>
                    <div className="row-actions">
                      <button onClick={(e) => handleUpdateClick(e, employee.id)} className='updateB'>Update</button>
                      <button onClick={(e) => deleteEmployee(e, employee.id)} className='deleteB'>Delete</button>
                    </div>
                  </td>
                )}
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListEmployeeComponent
