package com.gen_4.wildledger.sightings.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gen_4.wildledger.exceptions.SaveFileException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    private static final List<String> ALLOWED_FILE_TYPES = 
        List.of("image/png", "image/jpeg", "image/jpg", "image/webp");
    
    @Value("${app.storage.max-file-size}")
    private int MAX_FILE_SIZE;

    @Value("${app.storage.upload-dir}")
    private String UPLOAD_DIR;
    
    public void saveSightingImage(MultipartFile file, String path) {
        if (file.getSize() > MAX_FILE_SIZE) {
            log.error(
                "Image {}  too large: {} > {}", 
                file.getOriginalFilename(), 
                file.getSize(),
                MAX_FILE_SIZE
            );

            throw new IllegalArgumentException(String.format(
                "Image too large: %s is  greater than limit %d", 
                file.getOriginalFilename(),
                file.getSize(),
                MAX_FILE_SIZE
            ));
        }

        if (file.getContentType() == null) {
            log.error(
                "Image {} does not have content type", 
                file.getOriginalFilename()
            );

            throw new IllegalArgumentException(String.format(
                "Image %s does not have content type", 
                file.getOriginalFilename()
            )); 
        }

        if (ALLOWED_FILE_TYPES.stream()
            .noneMatch(imageType -> file.getContentType().equals(imageType))) {

            log.error(
                "Image {}  is not of an allowed type {} != {}", 
                file.getOriginalFilename(), 
                file.getContentType(),
                String.join(" | ", ALLOWED_FILE_TYPES)
            );

            throw new IllegalArgumentException(String.format(
                "Image %s has unallowed type %s", 
                file.getOriginalFilename(),
                file.getContentType()
            )); 
        }
        
        Path builtPath = Path.of(UPLOAD_DIR, path);
        try {
            Files.createDirectories(builtPath.getParent());
            file.transferTo(builtPath);

        } catch (IOException e) {
            log.error(
                "Error saving sighting image {} to file {}", 
                file.getOriginalFilename(), 
                builtPath,
                e
            );

            throw new SaveFileException(
                String.format("Failed to save file %s", file.getOriginalFilename()));

        } catch (IllegalArgumentException e) {
            log.error(
                "Error saving sighting image {} due to wrong path: {}", 
                file.getOriginalFilename(), 
                builtPath,
                e
            );

            throw e;
        }
    }

}
