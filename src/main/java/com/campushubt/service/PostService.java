package com.campushubt.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import com.campushubt.model.Post;
import com.campushubt.model.User;
import com.campushubt.model.Like;
import com.campushubt.repository.PostRepository;
import com.campushubt.repository.LikeRepository;
import com.campushubt.service.FileStorageService;
import com.campushubt.exception.ResourceNotFoundException;
import com.campushubt.exception.UnauthorizedException;
import com.campushubt.exception.BadRequestException;
import com.campushubt.model.PostMedia;
import com.campushubt.service.MediaService;
import java.io.IOException;
import com.campushubt.dto.PostDTO;
import com.campushubt.dto.UserDTO;
import com.campushubt.dto.MediaDTO;
import java.util.stream.Collectors;
import com.campushubt.repository.CommentRepository;
import com.campushubt.dto.PostResponseDTO;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import com.campushubt.repository.UserRepository;
import com.campushubt.dto.PostResponse;
import java.time.LocalDateTime;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import com.campushubt.mapper.PostMapper;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final FileStorageService fileStorageService;
    private final MediaService mediaService;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Transactional
    public Post createPost(String content, List<MultipartFile> files, User user) {
        try {
            String sanitizedContent = sanitizeContent(content);
            
            Post post = new Post();
            post.setContent(sanitizedContent);
            post.setUser(user);
            post.setCreatedAt(LocalDateTime.now());
            
            // Lưu post trước để có ID
            post = postRepository.save(post);
            
            // Xử lý media files nếu có
            if (files != null && !files.isEmpty()) {
                List<PostMedia> mediaList = new ArrayList<>();
                for (MultipartFile file : files) {
                    String url = fileStorageService.storeFile(file);
                    PostMedia media = new PostMedia();
                    media.setPost(post);
                    media.setUrl(url);
                    media.setType(file.getContentType());
                    
                    // Xử lý kích thước ảnh nếu là image
                    if (file.getContentType().startsWith("image/")) {
                        try {
                            BufferedImage img = ImageIO.read(file.getInputStream());
                            media.setWidth(img.getWidth());
                            media.setHeight(img.getHeight());
                        } catch (Exception e) {
                            logger.warn("Could not process image dimensions", e);
                        }
                    }
                    mediaList.add(media);
                }
                post.setMediaList(mediaList);
                post = postRepository.save(post);
            }
            
            return post;
        } catch (Exception e) {
            logger.error("Error creating post: ", e);
            throw new RuntimeException("Could not create post", e);
        }
    }

    private String sanitizeContent(String content) {
        try {
            if (content == null) return "";
            
            // Chuyển đổi về UTF-8
            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            String utf8Content = new String(bytes, StandardCharsets.UTF_8);
            
            // Xử lý các ký tự đặc biệt tiếng Việt
            String normalizedContent = Normalizer.normalize(utf8Content, Normalizer.Form.NFC);
            
            // Chỉ loại bỏ các ký tự không phải Unicode và giữ lại dấu tiếng Việt
            return normalizedContent.replaceAll("[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{Z}\\s]", "");
        } catch (Exception e) {
            logger.error("Error sanitizing content: ", e);
            return content;
        }
    }

    public List<Post> getFeedPosts(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findFeedPosts(userId, pageable);
    }

    public Map<String, Object> getFeedPostsWithMetadata(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Post> posts = postRepository.findFeedPosts(userId, pageable);
        long totalPosts = postRepository.countFeedPosts(userId);
        
        return Map.of(
            "posts", posts,
            "currentPage", page,
            "totalPages", (totalPosts + size - 1) / size,
            "totalItems", totalPosts,
            "hasMore", (page + 1) * size < totalPosts
        );
    }

    public Post getPost(Long postId) {
        return postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    public Post updatePost(Long postId, String content, MultipartFile media, User user) {
        Post post = getPost(postId);
        if (!post.getUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("You can only update your own posts");
        }

        post.setContent(content);

        if (media != null && !media.isEmpty()) {
            // Delete old media if exists
            if (post.getMediaList() != null && !post.getMediaList().isEmpty()) {
                for (PostMedia postMedia : post.getMediaList()) {
                    fileStorageService.deleteFile(postMedia.getUrl());
                }
                post.getMediaList().clear();
            }

            try {
                PostMedia newMedia = mediaService.processAndSaveMedia(media);
                newMedia.setPost(post);
                if (post.getMediaList() == null) {
                    post.setMediaList(new ArrayList<>());
                }
                post.getMediaList().add(newMedia);
            } catch (IOException e) {
                throw new RuntimeException("Error processing media file", e);
            }
        }

        return postRepository.save(post);
    }

    public void deletePost(Long postId, User user) {
        Post post = getPost(postId);
        if (!post.getUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("You can only delete your own posts");
        }

        // Delete media if exists
        if (post.getMediaList() != null && !post.getMediaList().isEmpty()) {
            for (PostMedia postMedia : post.getMediaList()) {
                fileStorageService.deleteFile(postMedia.getUrl());
            }
        }

        postRepository.delete(post);
    }

    @Transactional
    public Map<String, Object> toggleLike(Long postId, Long userId) {
        try {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
            
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
            // Kiểm tra like đã tồn tại chưa
            boolean isLiked = likeRepository.existsByPost_PostIdAndUser_UserID(postId, userId);
            
            if (isLiked) {
                // Nếu đã like thì xóa like
                likeRepository.deleteByPost_PostIdAndUser_UserID(postId, userId);
                
                // Cập nhật lại số lượng like của post
                Integer currentLikes = post.getLikesCount();
                post.setLikesCount(currentLikes != null && currentLikes > 0 ? currentLikes - 1 : 0);
                postRepository.save(post);
                
                return Map.of(
                    "success", true,
                    "liked", false,
                    "likesCount", post.getLikesCount()
                );
            } else {
                // Sử dụng synchronized block để tránh race condition
                synchronized (this) {
                    // Kiểm tra lại một lần nữa
                    if (!likeRepository.existsByPost_PostIdAndUser_UserID(postId, userId)) {
                        Like like = new Like();
                        like.setPost(post);
                        like.setUser(user);
                        
                        likeRepository.save(like);
                        
                        // Cập nhật lại số lượng like của post
                        Integer currentLikes = post.getLikesCount();
                        post.setLikesCount(currentLikes != null ? currentLikes + 1 : 1);
                        postRepository.save(post);
                    }
                }
                
                return Map.of(
                    "success", true,
                    "liked", true,
                    "likesCount", post.getLikesCount()
                );
            }
        } catch (DataIntegrityViolationException e) {
            // Xử lý trường hợp vi phạm ràng buộc unique
            logger.warn("Duplicate like attempt: postId={}, userId={}", postId, userId);
            return Map.of(
                "success", true,
                "liked", true,
                "likesCount", getPost(postId).getLikesCount()
            );
        } catch (Exception e) {
            logger.error("Error in toggleLike: ", e);
            throw new BadRequestException("Cannot process like operation: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<Post> getFeed(int page, int limit) {
        PageRequest pageRequest = PageRequest.of(
            page, 
            limit, 
            Sort.by("createdAt").descending()
        );
        return postRepository.findByIsDeletedFalse(pageRequest);
    }

    public PostDTO getPostWithDetails(Long postId, User currentUser) {
        Post post = getPost(postId);
        return convertToDTO(post, currentUser);
    }

    private PostDTO convertToDTO(Post post, User currentUser) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getPostId());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLikesCount(post.getLikesCount());
        
        // Set user info
        UserDTO userDTO = new UserDTO();
        userDTO.setId(post.getUser().getUserId());
        userDTO.setUsername(post.getUser().getUsername());
        userDTO.setFullName(post.getUser().getFullName());
        userDTO.setAvatarUrl(post.getUser().getAvatarUrl());
        dto.setUser(userDTO);

        // Convert media with aspect ratio
        List<MediaDTO> mediaDTOs = post.getMediaList().stream()
            .map(media -> {
                MediaDTO mediaDTO = new MediaDTO();
                mediaDTO.setId(media.getId());
                mediaDTO.setUrl(media.getUrl());
                mediaDTO.setType(media.getType());
                mediaDTO.setWidth(media.getWidth());
                mediaDTO.setHeight(media.getHeight());
                
                // Calculate aspect ratio
                if (media.getWidth() != null && media.getHeight() != null) {
                    double ratio = (double) media.getWidth() / media.getHeight();
                    mediaDTO.setAspectRatio(String.format("%.3f", ratio));
                }
                
                return mediaDTO;
            })
            .collect(Collectors.toList());
        
        dto.setMedia(mediaDTOs);
        
        // Check if current user liked the post
        if (currentUser != null) {
            dto.setLiked(likeRepository.existsByPost_PostIdAndUser_UserID(
                post.getPostId(), 
                currentUser.getUserId()
            ));
        }
        
        // Get comments count
        Integer commentCount = commentRepository.countByPost_PostId(post.getPostId());
        dto.setCommentsCount(commentCount);
        
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<PostResponseDTO> getFeedWithDetails(int page, int limit, User user) {
        Pageable pageable = PageRequest.of(page, limit);
        return postRepository.findByIsDeletedFalse(pageable)
            .map(post -> {
                PostResponseDTO dto = convertToResponseDTO(post);
                dto.setLiked(likeRepository.existsByPost_PostIdAndUser_UserID(
                    post.getPostId(), 
                    user.getUserId()
                ));
                return dto;
            });
    }

    private PostResponseDTO convertToResponseDTO(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getPostId());
        dto.setContent(post.getContent());
        dto.setLikesCount(post.getLikesCount());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        // Convert User to UserDTO
        UserDTO userDTO = convertToUserDTO(post.getUser());
        dto.setUser(userDTO);
        
        // Add media if exists
        if (post.getMediaList() != null && !post.getMediaList().isEmpty()) {
            dto.setMedia(post.getMediaList().stream()
                .map(media -> {
                    MediaDTO mediaDTO = new MediaDTO();
                    mediaDTO.setId(media.getId());
                    mediaDTO.setUrl(media.getUrl());
                    mediaDTO.setType(media.getType());
                    mediaDTO.setWidth(media.getWidth());
                    mediaDTO.setHeight(media.getHeight());
                    if (media.getWidth() != null && media.getHeight() != null) {
                        double ratio = (double) media.getWidth() / media.getHeight();
                        mediaDTO.setAspectRatio(String.format("%.3f", ratio));
                    }
                    return mediaDTO;
                })
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<PostResponseDTO> getPublicPosts(int page, int limit) {
        // Bỏ Sort vì đã có ORDER BY trong query
        Pageable pageable = PageRequest.of(page, limit);
        return postRepository.findByIsDeletedFalse(pageable)
            .map(this::convertToResponseDTO);
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
            .id(user.getUserId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .image(user.getImage())
            .avatarUrl(user.getAvatarUrl())
            .build();
    }

    public PostResponse getPostWithUserContext(Post post, Long userId) {
        boolean isLiked = likeRepository.existsByPost_PostIdAndUser_UserID(
            post.getPostId(), 
            userId
        );
        
        return PostResponse.builder()
            .id(post.getPostId())
            .content(post.getContent())
            .user(convertToUserDTO(post.getUser()))
            .createdAt(post.getCreatedAt())
            .likesCount(post.getLikesCount())
            .commentsCount(post.getCommentsCount())
            .isLiked(isLiked)
            .media(post.getMediaList().stream()
                .map(PostMedia::getUrl)
                .collect(Collectors.toList()))
            .build();
    }

    @Transactional(readOnly = true)
    public Page<PostDTO> getRecentPosts(Long userId, Pageable pageable) {
        return postRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc(pageable)
                .map(post -> convertToDetailedDTO(post, userId)); // Changed this line
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getTrendingPosts() {
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        return postRepository.findTrendingPosts(weekAgo)
                .stream()
                .map(post -> convertToDetailedDTO(post, null)) // Changed this line
                .collect(Collectors.toList());
    }

    public PostDTO convertToDetailedDTO(Post post, Long currentUserId) {
        return PostDTO.builder()
            .id(post.getPostId())
            .content(post.getContent())
            .user(convertToUserDTO(post.getUser()))
            .media(post.getMediaList().stream()
                .map(this::convertToMediaDTO)
                .collect(Collectors.toList()))
            .likesCount(post.getLikesCount())
            .commentsCount(post.getCommentsCount())
            .isLiked(currentUserId != null && likeRepository.existsByPost_PostIdAndUser_UserID(
                post.getPostId(), 
                currentUserId
            ))
            .createdAt(post.getCreatedAt())
            .updatedAt(post.getUpdatedAt())
            .build();
    }

    private MediaDTO convertToMediaDTO(PostMedia media) {
        MediaDTO dto = new MediaDTO();
        dto.setId(media.getId());
        dto.setUrl(media.getUrl());
        dto.setType(media.getType());
        dto.setWidth(media.getWidth());
        dto.setHeight(media.getHeight());
        if (media.getWidth() != null && media.getHeight() != null) {
            double ratio = (double) media.getWidth() / media.getHeight();
            dto.setAspectRatio(String.format("%.3f", ratio));
        }
        return dto;
    }
}