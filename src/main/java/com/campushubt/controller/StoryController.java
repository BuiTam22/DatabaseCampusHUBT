package com.campushubt.controller;

import com.campushubt.model.Story;
import com.campushubt.model.User;
import com.campushubt.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {
    private final StoryService storyService;

    @PostMapping
    public ResponseEntity<?> createStory(
            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal User user) {
        Story story = storyService.createStory(image, user);
        return ResponseEntity.ok(story);
    }

    @GetMapping
    public ResponseEntity<?> getStories(@AuthenticationPrincipal User user) {
        List<Story> stories = storyService.getStoriesForUser(user.getId());
        return ResponseEntity.ok(stories);
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<?> deleteStory(
            @PathVariable Long storyId,
            @AuthenticationPrincipal User user) {
        storyService.deleteStory(storyId, user);
        return ResponseEntity.ok().build();
    }
} 