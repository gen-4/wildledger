package com.gen_4.wildledger.sightings.dtos.conversors;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import com.gen_4.wildledger.sightings.dtos.SightingDto;
import com.gen_4.wildledger.sightings.models.Individual;
import com.gen_4.wildledger.sightings.models.Sighting;

public class SightingDtoConversor {

    public static SightingDto toSightingDto(Sighting sighting) {
        Individual individual = sighting.getIndividual();
        var builder = SightingDto.builder();
        builder
            .id(sighting.getId())
            .latitude(sighting.getLatitude())
            .longitude(sighting.getLongitude())
            .sightingDate(LocalDateTime.ofInstant(sighting.getSightingDate().toInstant(), ZoneId.of("UTC")))
            .createdAt(LocalDateTime.ofInstant(sighting.getCreatedAt().toInstant(), ZoneId.of("UTC")))
            .status(sighting.getStatus())
            .imagePath(sighting.getImagePath())
            .identificationConfidence(sighting.getIdentificationConfidence())
            .reporter(sighting.getReporter() != null ? sighting.getReporter().getUsername() : null)
            .hasIndividual(sighting.getIndividual() != null)
            .updatedAt(sighting.getUpdatedAt() != null ?LocalDateTime.ofInstant(
                sighting.getUpdatedAt().toInstant(), ZoneId.of("UTC")) : null);

        if (individual == null) {
            return builder.build();
        }

        builder
            .individualReporter(individual.getReporter() != null ? individual.getReporter().getUsername() : null)
            .individualId(individual.getId())
            .name(individual.getName())
            .species(individual.getSpecies())
            .individualCreatedAt(LocalDateTime.ofInstant(
                individual.getCreatedAt().toInstant(), ZoneId.of("UTC")
            ))
            .individualUpdatedAt(individual.getUpdatedAt() != null ? LocalDateTime.ofInstant(
                individual.getUpdatedAt().toInstant(), ZoneId.of("UTC")) : null
            );

        return builder.build();
    }

    public static List<SightingDto> toSightingDtos(List<Sighting> sightings) {
        return sightings.stream()
            .map(s -> toSightingDto(s))
            .toList();
    }

}
