package com.gen_4.wildledger.sightings.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gen_4.wildledger.sightings.dtos.SightingDto;
import com.gen_4.wildledger.sightings.dtos.SightingRequestDto;
import com.gen_4.wildledger.sightings.dtos.conversors.SightingDtoConversor;
import com.gen_4.wildledger.sightings.models.Sighting;
import com.gen_4.wildledger.sightings.services.SightingsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;


@RestController
@RequiredArgsConstructor
@Slf4j
public class SightingsController {

    private final SightingsService sightingsService;

    @PostMapping("/sighting")
    public ResponseEntity<SightingDto> createSighting(
        @RequestParam MultipartFile file,
        @RequestPart SightingRequestDto sightingRequest,
        @RequestAttribute long userId
    ) {
        String extension;
        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.contains(".")) {
            log.error("Error extracting extension of file {}: Does not contain extension", fileName);
            throw new IllegalArgumentException("File name does not contain extension: " + fileName);
        }

        try {
            extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        } catch (Exception e) {
            log.error("Error extracting extension of file: " + fileName, e);
            throw new IllegalArgumentException("File name not processable: " + fileName);
        }

        if (!extension.matches("[a-zA-Z0-9]+")) {
            log.error("Error extracting extension of file {}: It is not an allowed extension", fileName);
            throw new IllegalArgumentException("Invalid file extension: " + extension);
        }

        Sighting sighting = sightingsService.createSighting(
            userId,
            sightingRequest.getLatitude(), 
            sightingRequest.getLongitude(), 
            sightingRequest.getSightingDate(),
            extension,
            file
        );

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(SightingDtoConversor.toSightingDto(sighting, null));
    }
    
    
}
