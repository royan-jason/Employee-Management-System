package com.bmc.employe.service;

import com.bmc.employe.dto.EmployeeDTO;

import java.util.List;
import java.util.Optional;

public interface EmployeeServiceInterface {

    EmployeeDTO saveEmployee(EmployeeDTO employeeDTO);
    Optional<EmployeeDTO> getEmployeeById(int id);
    List<EmployeeDTO> getAllEmployee();
    EmployeeDTO updateEmployee(int id, EmployeeDTO employeeDTO);
    void deleteEmployee(int id);
}
