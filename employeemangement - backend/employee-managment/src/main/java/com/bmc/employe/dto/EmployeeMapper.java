package com.bmc.employe.dto;

import com.bmc.employe.model.Employee;
import com.bmc.employe.model.User;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeDTO toDTO(Employee employee) {
        if (employee == null) {
            return null;
        }
        User managedBy = employee.getManagedBy();
        return new EmployeeDTO(
                employee.getId(),
                employee.getFirstname(),
                employee.getLastname(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getPosition(),
                employee.getSalary(),
                employee.getHireDate(),
                managedBy != null ? managedBy.getUsername() : null
        );
    }

    // Note: managedBy is intentionally NOT set here - it's not something a client
    // should be able to set via the request body. The service layer assigns it
    // from the currently authenticated user instead.
    public Employee toEntity(EmployeeDTO dto) {
        if (dto == null) {
            return null;
        }
        Employee employee = new Employee();
        employee.setId(dto.getId());
        employee.setFirstname(dto.getFirstname());
        employee.setLastname(dto.getLastname());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());
        employee.setHireDate(dto.getHireDate());
        return employee;
    }
}
