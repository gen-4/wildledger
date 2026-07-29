package com.gen_4.wildledger.sightings.dtos.conversors;

import org.springframework.data.domain.Page;

import com.gen_4.wildledger.sightings.dtos.MySightingProxyDto;
import com.gen_4.wildledger.sightings.models.MySightingProxy;

public class MySightingProxyDtoConversor {

    public static MySightingProxyDto toMySightingProxyDto(MySightingProxy sighting) {
        return MySightingProxyDto.builder()
            .id(sighting.getId())
            .individualId(sighting.getIndividualId())
            .name(sighting.getName())
            .latitude(sighting.getLatitude())
            .longitude(sighting.getLongitude())
            .imagePath(sighting.getImagePath())
            .status(sighting.getStatus())
            .build();
    }

    public static Page<MySightingProxyDto> toMySightingProxyDtos(Page<MySightingProxy> sightings) {
        return sightings.map(sighting -> toMySightingProxyDto(sighting));
    }
    
}
