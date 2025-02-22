package com.campushubt.service;

import com.campushubt.model.PostMedia;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final FileStorageService fileStorageService;

    public PostMedia processAndSaveMedia(MultipartFile file) throws IOException {
        String fileName = fileStorageService.storeFile(file);
        String fileUrl = fileStorageService.getFileUrl(fileName);
        
        PostMedia media = new PostMedia();
        media.setUrl(fileUrl);
        media.setType(determineMediaType(file.getContentType()));
        
        // Xử lý kích thước ảnh nếu là image
        if (file.getContentType().startsWith("image/")) {
            try (InputStream is = file.getInputStream()) {
                BufferedImage bufferedImage = ImageIO.read(is);
                if (bufferedImage != null) {
                    media.setWidth(bufferedImage.getWidth());
                    media.setHeight(bufferedImage.getHeight());
                }
            }
        }
        
        return media;
    }
    
    private String determineMediaType(String contentType) {
        if (contentType == null) return "OTHER";
        if (contentType.startsWith("image/")) return "IMAGE";
        if (contentType.startsWith("video/")) return "VIDEO";
        return "OTHER";
    }
    
    private String saveFile(MultipartFile file, String filename) {
        // Implement your file storage logic here
        // Could be local storage, S3, etc.
        return "url_to_file/" + filename;
    }
} 