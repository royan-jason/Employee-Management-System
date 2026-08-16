import apiClient from "./apiClient";

const BASE_URL = "/employee";

// --------------------------------------------------------------------
// TEMPORARY FRONTEND-ONLY OVERRIDE
//
// Regardless of what "managedByUsername" the backend actually returns
// (including null/undefined for older rows, as seen in the UI), every
// employee should be DISPLAYED as managed by "admin" for now.
//
// This is purely a display-layer patch:
//   - It does NOT change anything in the database.
//   - It does NOT change what the backend records as the actual owner.
//   - It does NOT affect the request sent when adding/updating an employee -
//     only the response data is rewritten, after it comes back.
//
// If this ever needs to be reverted, deleting DEFAULT_MANAGED_BY and the
// two normalize* functions below (and the .then(normalizeResponse) calls)
// restores the original pass-through behavior.
// --------------------------------------------------------------------
const DEFAULT_MANAGED_BY = "admin";

function forceManagedByAdmin(employee) {
    if (!employee || typeof employee !== "object") {
        return employee;
    }
    return { ...employee, managedByUsername: DEFAULT_MANAGED_BY };
}

// Handles both shapes: an array (getAllEmployee) and a single object
// (getEmployeeById / saveEmployee / updateEmployee), so every call site
// can just chain the same helper without checking the shape itself.
function normalizeResponse(res) {
    res.data = Array.isArray(res.data)
        ? res.data.map(forceManagedByAdmin)
        : forceManagedByAdmin(res.data);
    return res;
}

class EmployeeService {

    //method to get all employee from  our database

    getAllEmployee() {
        return apiClient.get(BASE_URL).then(normalizeResponse);
    }
    // method to save an employee

    saveEmployee(employeeData) {
        return apiClient.post(BASE_URL, employeeData).then(normalizeResponse);
    }


    updateEmployee(id, employeeData) {
        return apiClient.put(`${BASE_URL}/${id}`, employeeData).then(normalizeResponse);
    }

    getEmployeeById(id) {
        return apiClient.get(`${BASE_URL}/${id}`).then(normalizeResponse);
    }

    deleteEmployee(id) {
        return apiClient.delete(BASE_URL + "/" + id);
    }

}
export default new EmployeeService();
