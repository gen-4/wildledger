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
public class MySightingProxyDto {

    private long id;
    private Long individualId;
    private String name;
    private double latitude;
    private double longitude;
    private String imagePath;
    private SightingStatus status;
    private LocalDateTime createdAt;
    
}
