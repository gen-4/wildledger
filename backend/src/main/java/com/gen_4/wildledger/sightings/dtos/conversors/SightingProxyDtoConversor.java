package com.gen_4.wildledger.sightings.dtos.conversors;

import java.util.List;

import com.gen_4.wildledger.sightings.dtos.SightingProxyDto;
import com.gen_4.wildledger.sightings.models.SightingProxy;

public class SightingProxyDtoConversor {

    public static SightingProxyDto toSightingProxyDto(SightingProxy sighting) {
        return SightingProxyDto.builder()
            .id(sighting.getId())
            .individualId(sighting.getIndividualId())
            .name(sighting.getName())
            .latitude(sighting.getLatitude())
            .longitude(sighting.getLongitude())
            .imagePath(sighting.getImagePath())
            .build();
    }

    public static List<SightingProxyDto> toSightingProxyDtos(List<SightingProxy> sightings) {
        return sightings.stream().map(sighting ->
            toSightingProxyDto(sighting)
        ).toList();
    }
    
}
