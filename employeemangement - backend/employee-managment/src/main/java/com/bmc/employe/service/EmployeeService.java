package com.bmc.employe.service;

import com.bmc.employe.dto.EmployeeDTO;
import com.bmc.employe.dto.EmployeeMapper;
import com.bmc.employe.exception.EmployeeNotFoundException;
import com.bmc.employe.model.Employee;
import com.bmc.employe.model.User;
import com.bmc.employe.repository.EmployeeRepository;
import com.bmc.employe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService implements EmployeeServiceInterface {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private UserRepository userRepository;

    @Override
    public EmployeeDTO saveEmployee(EmployeeDTO employeeDTO) {
        Employee employee = employeeMapper.toEntity(employeeDTO);
        employee.setManagedBy(currentUser());
        Employee saved = employeeRepository.save(employee);
        return employeeMapper.toDTO(saved);
    }

    @Override
    public Optional<EmployeeDTO> getEmployeeById(int id) {
        return employeeRepository.findById(id).map(employeeMapper::toDTO);
    }

    @Override
    public List<EmployeeDTO> getAllEmployee() {
        return employeeRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO updateEmployee(int id, EmployeeDTO employeeDTO) {
        // Was: employeeRepository.findById(id).orElseThrow() - threw a bare
        // NoSuchElementException that the generic handler turned into an opaque 500.
        // Now surfaces a proper 404 with a clear message when the id doesn't exist.
        Employee employeeToUpdate = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
        employeeToUpdate.setFirstname(employeeDTO.getFirstname());
        employeeToUpdate.setLastname(employeeDTO.getLastname());
        employeeToUpdate.setEmail(employeeDTO.getEmail());
        employeeToUpdate.setDepartment(employeeDTO.getDepartment());
        employeeToUpdate.setPosition(employeeDTO.getPosition());
        employeeToUpdate.setSalary(employeeDTO.getSalary());
        employeeToUpdate.setHireDate(employeeDTO.getHireDate());
        Employee updated = employeeRepository.save(employeeToUpdate);
        return employeeMapper.toDTO(updated);
    }

    @Override
    public void deleteEmployee(int id) {
        // Was: employeeRepository.deleteById(id) - silently a no-op on a missing id,
        // so the client got a false "success". Now checks existence first.
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }
        employeeRepository.deleteById(id);
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return userRepository.findByUsername(auth.getName()).orElse(null);
    }
}
