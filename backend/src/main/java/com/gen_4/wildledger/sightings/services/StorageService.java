package com.gen_4.wildledger.sightings.services;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    public void saveSightingImage(MultipartFile file, String path);

    public String getSightingImage(String path);
    
}
