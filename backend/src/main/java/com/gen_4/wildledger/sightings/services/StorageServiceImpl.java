package com.gen_4.wildledger.sightings.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.apache.tika.Tika;
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

    private static final Tika tika = new Tika();

    private static final Map<String, List<String>> ALLOWED_MIME_TYPES = Map.of(
        "image/png", List.of("png"),
        "image/jpeg", List.of("jpg", "jpeg"),
        "image/webp", List.of("webp")
    );
    
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

        String detectedMimeType;
        try {
            detectedMimeType = tika.detect(file.getInputStream());
        } catch (IOException e) {
            log.error(
                "Failed to detect MIME type for image {}",
                file.getOriginalFilename(),
                e
            );

            throw new IllegalArgumentException(String.format(
                "Failed to detect MIME type for image %s",
                file.getOriginalFilename()
            ));
        }

        if (!ALLOWED_MIME_TYPES.containsKey(detectedMimeType)) {
            log.error(
                "Image {} has disallowed MIME type: {}",
                file.getOriginalFilename(),
                detectedMimeType
            );

            throw new IllegalArgumentException(String.format(
                "Image %s has disallowed type %s",
                file.getOriginalFilename(),
                detectedMimeType
            ));
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase()
            : "";

        List<String> validExtensions = ALLOWED_MIME_TYPES.get(detectedMimeType);
        if (validExtensions.stream().noneMatch(ext -> ext.equalsIgnoreCase(fileExtension))) {
            log.error(
                "Image {} extension '{}' does not match detected MIME type {} (expected one of: {})",
                originalFilename,
                fileExtension,
                detectedMimeType,
                String.join(", ", validExtensions)
            );

            throw new IllegalArgumentException(String.format(
                "Image %s has extension '%s' which does not match detected type %s (expected one of: %s)",
                originalFilename,
                fileExtension,
                detectedMimeType,
                String.join(", ", validExtensions)
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
