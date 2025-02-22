package com.campushubt.security;

import com.campushubt.model.User;
import com.campushubt.model.AccountStatus;
import com.campushubt.model.UserRole;
import com.campushubt.model.UserStatus;
import com.campushubt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CustomUserDetailsService(
            UserRepository userRepository,
            @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
            .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username/email: " + usernameOrEmail));

        if (user.getAccountStatus() == null) {
            user.setAccountStatus(AccountStatus.ACTIVE);
        }

        return UserDetailsImpl.build(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public User processOAuthUser(String email, String name, String googleId) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 8));
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    newUser.setFullName(name);
                    newUser.setRole(UserRole.STUDENT);
                    newUser.setStatus(UserStatus.ONLINE);
                    newUser.setAccountStatus(AccountStatus.ACTIVE);
                    newUser.setProvider("google");
                    newUser.setProviderId(googleId);
                    return newUser;
                });

        if (user.getUserId() != null && user.getProviderId() == null) {
            user.setProviderId(googleId);
            user.setProvider("google");
        }

        return userRepository.save(user);
    }
}