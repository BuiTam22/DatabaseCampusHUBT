package com.campushubt.service;

// Update imports to explicitly reference classes from dto.auth package
import com.campushubt.dto.auth.AuthResponse;
import com.campushubt.dto.auth.LoginRequest;
import com.campushubt.dto.auth.LoginResponse;
import com.campushubt.dto.auth.RegisterRequest;
import com.campushubt.exception.ResourceNotFoundException;
import com.campushubt.exception.BadRequestException;
import com.campushubt.model.User;
import com.campushubt.repository.UserRepository;
import com.campushubt.security.JwtTokenProvider;
import com.campushubt.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.BadCredentialsException;
import jakarta.annotation.PreDestroy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.campushubt.model.AccountStatus;
import com.campushubt.exception.AccountDisabledException;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Date;
import java.time.ZoneId;
import com.campushubt.model.UserStatus;
import com.campushubt.model.UserRole;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(UserRole.STUDENT);
        user.setStatus(UserStatus.ONLINE);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setProvider("local");
        user.setCreatedAt(LocalDateTime.now());
        // Removed updating lastLogin on registration; it will be updated on login
        // user.setLastLogin(new Date());

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = tokenProvider.generateToken(UserDetailsImpl.build(savedUser));

        // Return response with token and user info
        return new AuthResponse(
            token,
            savedUser.getUserId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getFullName(),
            savedUser.getRole().toString(),
            savedUser.getStatus().toString(),
            savedUser.getImage()
        );
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        try {
            // Validate request
            if (StringUtils.isEmpty(request.getUsernameOrEmail()) || StringUtils.isEmpty(request.getPassword())) {
                throw new BadRequestException("Username/email and password are required");
            }

            // Find user
            User user = userRepository.findByUsernameOrEmail(
                request.getUsernameOrEmail(), 
                request.getUsernameOrEmail()
            ).orElseThrow(() -> new UsernameNotFoundException(
                String.format("User not found with username or email: %s", request.getUsernameOrEmail())
            ));

            // Check if account is disabled
            if (user.getAccountStatus() == AccountStatus.DISABLED) {
                log.warn("Attempted login to disabled account: {}", user.getUsername());
                throw new AccountDisabledException("This account has been disabled");
            }

            // Check password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                log.warn("Invalid password attempt for user: {}", user.getUsername());
                throw new BadCredentialsException("Invalid password");
            }

            // Update last login
            user.setLastLogin(LocalDateTime.now());
            user.setStatus(UserStatus.ONLINE);
            userRepository.save(user);

            // Generate token
            String token = tokenProvider.generateToken(UserDetailsImpl.build(user));
            
            // Build response
            return LoginResponse.builder()
                .token(token)
                .userID(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().toString())
                .status(user.getStatus().toString())
                .image(user.getImage())
                .build();

        } catch (UsernameNotFoundException ex) {
            log.error("Login failed - User not found: {}", request.getUsernameOrEmail());
            throw new org.springframework.security.core.AuthenticationException("Account does not exist") {};
        } catch (BadCredentialsException ex) {
            log.error("Login failed - Invalid credentials for user: {}", request.getUsernameOrEmail());
            throw new org.springframework.security.core.AuthenticationException("Invalid username/email or password") {};
        } catch (AccountDisabledException ex) {
            log.error("Login failed - Disabled account: {}", request.getUsernameOrEmail());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error during login", ex);
            throw new org.springframework.security.core.AuthenticationException("An error occurred during login") {};
        }
    }

    @Transactional
    public void sendPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24); // Sử dụng LocalDateTime

        userRepository.updateResetToken(email, token, expiryDate);
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        LocalDateTime now = LocalDateTime.now();
        if (user.getResetTokenExpiry() == null || now.isAfter(user.getResetTokenExpiry())) {
            throw new BadRequestException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                throw new BadCredentialsException("User not authenticated");
            }

            // Get username from authentication
            Object principal = authentication.getPrincipal();
            String username;
            
            if (principal instanceof UserDetailsImpl) {
                username = ((UserDetailsImpl) principal).getUsername();
            } else if (principal instanceof String) {
                username = (String) principal;
            } else {
                throw new BadCredentialsException("Invalid authentication principal");
            }

            // Find and return user
            return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        } catch (Exception e) {
            logger.error("Error getting current user", e);
            throw new BadCredentialsException("Error retrieving user details");
        }
    }

    @PreDestroy
    public void cleanup() {
        log.info("Cleaning up AuthService resources...");
        // Add any cleanup code here
    }
}