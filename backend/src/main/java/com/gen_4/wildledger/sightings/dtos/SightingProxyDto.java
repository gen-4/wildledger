package com.gen_4.wildledger.sightings.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SightingProxyDto {

    private long id;
    private Long individualId;
    private String name;
    private double latitude;
    private double longitude;
    private String imagePath;
    
}
