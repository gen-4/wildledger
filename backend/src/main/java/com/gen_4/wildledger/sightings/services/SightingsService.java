package com.gen_4.wildledger.sightings.services;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.gen_4.wildledger.sightings.models.Sighting;

public interface SightingsService {

    public Sighting createSighting(
        long userId, 
        double latitude, 
        double longitude, 
        LocalDateTime sightingDate,
        String extension,
        MultipartFile file
    );
    
}