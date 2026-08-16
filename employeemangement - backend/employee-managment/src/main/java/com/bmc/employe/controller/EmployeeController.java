package com.bmc.employe.controller;


import com.bmc.employe.dto.EmployeeDTO;
import com.bmc.employe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;
    // we are bringing in EmployeService instance

    // Read access: any authenticated user (USER or ADMIN) can view employees.
    // Write access (create/update/delete): ADMIN only. A non-admin token that
    // hits these endpoints gets a 403 with a clear "not authorized" message,
    // handled centrally in GlobalExceptionHandler.

//    here is a postrequest .we  gonna be saving an employee
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public EmployeeDTO saveEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        return employeeService.saveEmployee(employeeDTO);
    }
// here we are getting alll employee
    @GetMapping
    public List<EmployeeDTO> getAllEmployee(){
        return employeeService.getAllEmployee();
    }
   /* here are two "@Getmapping " so how should it will go to the correct one :
   so we will give an parameter specification with the annotation .*/
//    here we getting one employee by Id
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable int id){
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
//    we gonna updating an employee
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public EmployeeDTO updateEmployee(@PathVariable int id, @Valid @RequestBody EmployeeDTO employeeDTO){
        return employeeService.updateEmployee(id, employeeDTO);
    }

//      we gonna deleting an employee
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable int id){
        employeeService.deleteEmployee(id);
    }
}
