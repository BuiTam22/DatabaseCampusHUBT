package com.campushubt.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;
    private final String baseUrl;

    public FileStorageService(
        @Value("${file.upload-dir:uploads/media}") String uploadDir,
        @Value("${app.base-url:http://localhost:8080}") String baseUrl
    ) {
        this.fileStorageLocation = Paths.get(uploadDir)
            .toAbsolutePath().normalize();
        this.baseUrl = baseUrl;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) throws IOException {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + fileExtension;

        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public String getFileUrl(String fileName) {
        return baseUrl + "/uploads/media/" + fileName;
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            try {
                Path filePath = this.fileStorageLocation.resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException ex) {
                throw new RuntimeException("Error deleting file: " + fileName, ex);
            }
        }
    }
} 