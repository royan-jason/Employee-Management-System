import React, { useEffect, useState } from 'react'
import "./AddEmployee.css"
import EmployeeService from '../../service/EmployeeService';
import AuthService from '../../service/AuthService';
import { notifyUnauthorized } from '../../service/notify';
import { useNavigate, Link, useParams } from 'react-router-dom';

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "Human Resources", "Operations", "Customer Support"];

const AddEmployeeComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [managedByUsername, setManagedByUsername] = useState('');
  const [error, setError] = useState('');

  const { id } = useParams(); // used to extract the id from the url for the update flow
  const navigate = useNavigate();
  const isAdmin = AuthService.isAdmin();

  const employeeData = {
    firstname: firstName,
    lastname: lastName,
    email: email,
    department: department,
    position: position,
    salary: salary === '' ? null : Number(salary),
    hireDate: hireDate,
  };

  function title() {
    return id ? "Update Employee" : "Add Employee";
  }

  // Read-only users can reach this page by typing the URL directly even though
  // the button that leads here is hidden/intercepted for them - so we guard
  // here too and bounce them back with the same popup.
  useEffect(() => {
    if (!isAdmin) {
      notifyUnauthorized(`${title()} requires administrator access.`);
      navigate("/employee", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (id) {
      EmployeeService.getEmployeeById(id).then(res => {
        setFirstName(res.data.firstname);
        setLastName(res.data.lastname);
        setEmail(res.data.email);
        setDepartment(res.data.department || '');
        setPosition(res.data.position || '');
        setSalary(res.data.salary ?? '');
        setHireDate(res.data.hireDate || '');
        setManagedByUsername(res.data.managedByUsername || '');
      }).catch(e => console.log(e));
    }
  }, [id]);

  function extractErrorMessage(e) {
    const data = e.response?.data;
    if (!data) return "Something went wrong. Please check the backend is running and try again.";
    if (data.error) return data.error;
    const firstFieldError = Object.values(data)[0];
    return firstFieldError || "Something went wrong. Please try again.";
  }

  function saveEmployee(e) {
    e.preventDefault();
    setError('');

    const requiredFilled = firstName !== "" && lastName !== "" && email !== ""
      && department !== "" && position !== "" && salary !== "" && hireDate !== "";

    if (!requiredFilled) {
      setError("Please fill all fields.");
      return;
    }

    if (id) {
      EmployeeService.updateEmployee(id, employeeData)
        .then(() => navigate("/employee"))
        .catch(e => {
          console.log(e);
          setError(extractErrorMessage(e));
        });
    } else {
      EmployeeService.saveEmployee(employeeData)
        .then(() => navigate("/employee"))
        .catch(e => {
          console.log(e);
          setError(extractErrorMessage(e));
        });
    }
  }

  if (!isAdmin) {
    return null; // the useEffect above is already redirecting away
  }

  return (
    <div className='container1'>
      <div className='row'>
        <div className='card'>
          <h2 className='text-center1'>{title()}</h2>
          {managedByUsername && (
            <p className="managed-by-note">Managed by <strong>{managedByUsername}</strong></p>
          )}
          <div className='card-body'>
            {error && <p className="form-error">{error}</p>}
            <form>
              <div className="form-grid">
                <div className='form-group'>
                  <label>First Name</label>
                  <input className='form-control' value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text" placeholder='Enter first name' />
                </div>
                <div className='form-group'>
                  <label>Last Name</label>
                  <input className='form-control' value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text" placeholder='Enter last name' />
                </div>
                <div className='form-group form-group--wide'>
                  <label>Email</label>
                  <input className='form-control' value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" placeholder='Enter email address' />
                </div>
                <div className='form-group'>
                  <label>Department</label>
                  <select className='form-control' value={department}
                    onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className='form-group'>
                  <label>Position</label>
                  <input className='form-control' value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    type="text" placeholder='e.g. Senior Analyst' />
                </div>
                <div className='form-group'>
                  <label>Salary (USD)</label>
                  <input className='form-control' value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    type="number" min="0" step="1000" placeholder='e.g. 85000' />
                </div>
                <div className='form-group'>
                  <label>Hire Date</label>
                  <input className='form-control' value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    type="date" />
                </div>
              </div>

              <div className='buttons'>
                <button className='btn-save' onClick={(e) => saveEmployee(e)}>Save</button>
                <Link to={"/employee"}><button type="button" className='btn-cancel'>Cancel</button></Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEmployeeComponent
