package com.bmc.employe.config;

import com.bmc.employe.model.Role;
import com.bmc.employe.model.User;
import com.bmc.employe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default ADMIN account on startup if one doesn't already exist, so
 * there's always at least one user who can create/update/delete employees.
 *
 * app.admin.password is set (in application.properties) to reuse
 * spring.datasource.password, per request. Worth knowing: this means your
 * app login password and DB root password are now the same secret, so a leak
 * of either one compromises both, and rotating one means rotating both in
 * lockstep. If that's not what you want, give app.admin.password its own
 * value instead of ${spring.datasource.password}.
 */
@Component
public class AdminAccountInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername(adminUsername)) {
            return;
        }
        User admin = new User(
                adminUsername,
                adminEmail,
                passwordEncoder.encode(adminPassword),
                Role.ADMIN
        );
        userRepository.save(admin);
    }
}
