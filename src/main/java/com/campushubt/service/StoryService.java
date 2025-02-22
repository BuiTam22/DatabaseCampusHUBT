package com.campushubt.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.campushubt.model.Story;
import com.campushubt.repository.StoryRepository;
import com.campushubt.service.FileStorageService;
import com.campushubt.exception.ResourceNotFoundException;
import com.campushubt.exception.UnauthorizedException;
import com.campushubt.model.User;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@Transactional
@RequiredArgsConstructor
public class StoryService {
    private final StoryRepository storyRepository;
    private final FileStorageService fileStorageService;
    private final MediaService mediaService;

    public Story createStory(MultipartFile media, User user) {
        Story story = new Story();
        story.setUser(user);
        story.setCreatedAt(Instant.now());
        story.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));

        try {
            String fileName = fileStorageService.storeFile(media);
            story.setMediaUrl(fileStorageService.getFileUrl(fileName));
            story.setMediaType(determineMediaType(media.getContentType()));
            return storyRepository.save(story);
        } catch (IOException e) {
            throw new RuntimeException("Error processing story media", e);
        }
    }

    private String determineMediaType(String contentType) {
        if (contentType == null) return "OTHER";
        if (contentType.startsWith("image/")) return "IMAGE";
        if (contentType.startsWith("video/")) return "VIDEO";
        return "OTHER";
    }

    public List<Story> getStoriesForUser(Long userId) {
        return storyRepository.findStoriesForUser(userId, Instant.now());
    }

    public void deleteStory(Long storyId, User user) {
        Story story = storyRepository.findById(storyId)
            .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
            
        if (!story.getUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("You can only delete your own stories");
        }
        
        if (story.getMediaUrl() != null) {
            fileStorageService.deleteFile(story.getMediaUrl());
        }
        
        storyRepository.delete(story);
    }
} 