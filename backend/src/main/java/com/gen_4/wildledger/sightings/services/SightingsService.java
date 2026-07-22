package com.gen_4.wildledger.sightings.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.gen_4.wildledger.sightings.models.Sighting;
import com.gen_4.wildledger.sightings.models.SightingProxy;

public interface SightingsService {

    public Sighting createSighting(
        long userId, 
        double latitude, 
        double longitude, 
        LocalDateTime sightingDate,
        String extension,
        MultipartFile file
    );

    public List<SightingProxy> getSightings();
    
}