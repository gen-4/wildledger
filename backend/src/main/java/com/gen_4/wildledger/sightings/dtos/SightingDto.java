package com.gen_4.wildledger.sightings.dtos;

import java.time.LocalDateTime;

import com.gen_4.wildledger.sightings.models.SightingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SightingDto {

    private long id;
    private double latitude;
    private double longitude;
    private LocalDateTime sightingDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private SightingStatus status;
    private String imagePath;
    private Float identificationConfidence;
    private String reporter;
    private boolean hasIndividual;
    private String individualReporter;
    private Long individualId;
    private String name;
    private String species;
    private LocalDateTime individualCreatedAt;
    private LocalDateTime individualUpdatedAt;
    
}
