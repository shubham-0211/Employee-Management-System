package com.technova.employeemanagement.user;

import com.technova.employeemanagement.employee.Employee;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = loadUserEntityByUsername(username);

        boolean activeUserAccount =
                user.getStatus() == UserStatus.ACTIVE;

        Employee employee = user.getEmployee();

        boolean activeEmployee =
                employee == null
                        || "ACTIVE".equalsIgnoreCase(
                                employee.getEmploymentStatus()
                        );

        boolean accountEnabled =
                activeUserAccount && activeEmployee;

        UserDetails springUser =
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPasswordHash())
                        .roles(user.getRole().name())
                        .disabled(!accountEnabled)
                        .build();

        return new CustomUserDetails(
                springUser,
                user.isMustChangePassword()
        );
    }

    @Transactional(readOnly = true)
    public User loadUserEntityByUsername(String username)
            throws UsernameNotFoundException {

        String identifier = username.trim();

        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Invalid username or password."
                ));
    }

    public static class CustomUserDetails
            extends org.springframework.security.core.userdetails.User {

        private final boolean mustChangePassword;

        public CustomUserDetails(
                UserDetails delegate,
                boolean mustChangePassword
        ) {
            super(
                    delegate.getUsername(),
                    delegate.getPassword(),
                    delegate.isEnabled(),
                    delegate.isAccountNonExpired(),
                    delegate.isCredentialsNonExpired(),
                    delegate.isAccountNonLocked(),
                    delegate.getAuthorities()
            );

            this.mustChangePassword = mustChangePassword;
        }

        public boolean isMustChangePassword() {
            return mustChangePassword;
        }
    }
}