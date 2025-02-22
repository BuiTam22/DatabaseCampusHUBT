package com.campushubt.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import com.campushubt.model.User;
import com.campushubt.model.AccountStatus;
import com.campushubt.repository.UserRepository;
import com.campushubt.service.EmailService;
import com.campushubt.exception.ResourceNotFoundException;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingOrEmailContainingOrFullNameContaining(
            query, query, query
        );
    }

    public void lockUserAccount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setAccountStatus(AccountStatus.LOCKED);
        userRepository.save(user);
    }

    public void unlockUserAccount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(user);
    }
} 