package com.gen_4.wildledger.sightings.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SightingRequestDto {
    
    private double latitude;
    private double longitude;
    private LocalDateTime sightingDate;
    
}
