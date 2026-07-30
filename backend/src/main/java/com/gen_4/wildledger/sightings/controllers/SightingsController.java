package com.gen_4.wildledger.sightings.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gen_4.wildledger.exceptions.NotAllowedException;
import com.gen_4.wildledger.sightings.dtos.MySightingProxyDto;
import com.gen_4.wildledger.sightings.dtos.SightingDto;
import com.gen_4.wildledger.sightings.dtos.SightingProxyDto;
import com.gen_4.wildledger.sightings.dtos.SightingRequestDto;
import com.gen_4.wildledger.sightings.dtos.conversors.MySightingProxyDtoConversor;
import com.gen_4.wildledger.sightings.dtos.conversors.SightingDtoConversor;
import com.gen_4.wildledger.sightings.dtos.conversors.SightingProxyDtoConversor;
import com.gen_4.wildledger.sightings.models.Sighting;
import com.gen_4.wildledger.sightings.services.SightingsService;
import com.gen_4.wildledger.sightings.services.StorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequiredArgsConstructor
@Slf4j
public class SightingsController {

    private final SightingsService sightingsService;

    private final StorageService storageService;

    @PostMapping("/sighting")
    public ResponseEntity<SightingDto> createSighting(
        @RequestParam MultipartFile file,
        @RequestPart SightingRequestDto sightingRequest,
        @RequestAttribute long userId
    ) {
        String extension;
        Sighting sighting;
        SightingDto sightingDto;
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

        sighting = sightingsService.createSighting(
            userId,
            sightingRequest.getLatitude(), 
            sightingRequest.getLongitude(), 
            sightingRequest.getSightingDate(),
            extension,
            file
        );

        sightingDto = SightingDtoConversor.toSightingDto(sighting);
        sightingDto.setImagePath(storageService.getSightingImage(sighting.getImagePath()));
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(sightingDto);
    }

    @GetMapping("/sightings")
    public ResponseEntity<List<SightingProxyDto>> getSightings() {
        return ResponseEntity.status(HttpStatus.OK)
            .body(SightingProxyDtoConversor.toSightingProxyDtos(sightingsService.getSightings()).stream()
                .map(sighting -> {
                    sighting.setImagePath(storageService.getSightingImage(sighting.getImagePath()));
                    return sighting;
                }).toList()
            );
    }

    @GetMapping("/user/{id}/sightings")
    public ResponseEntity<Page<MySightingProxyDto>> getMySightings(
        @PathVariable long id,
        @RequestAttribute long userId,
        Pageable pageable
    ) {
        if (id != userId) {
            throw new NotAllowedException("Requested user sightings " + id + " does not match logged user " + userId);
        }

        return ResponseEntity.status(HttpStatus.OK)
            .body(MySightingProxyDtoConversor.toMySightingProxyDtos(sightingsService.getMySightings(userId, pageable))
                .map(sighting -> {
                    sighting.setImagePath(storageService.getSightingImage(sighting.getImagePath()));
                    return sighting;
                })
            );
    }
    
}
