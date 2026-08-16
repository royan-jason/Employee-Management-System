package com.bmc.employe.exception;

/**
 * Thrown when an operation is attempted against an employee id that doesn't exist.
 * Mapped to a 404 response by GlobalExceptionHandler, instead of leaking a raw
 * NoSuchElementException as a generic 500.
 */
public class EmployeeNotFoundException extends RuntimeException {

    public EmployeeNotFoundException(int id) {
        super("Employee not found with id: " + id);
    }
}
