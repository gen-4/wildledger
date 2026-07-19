package com.gen_4.wildledger.sightings.dtos.conversors;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import com.gen_4.wildledger.auth.models.User;
import com.gen_4.wildledger.sightings.dtos.SightingDto;
import com.gen_4.wildledger.sightings.models.Individual;
import com.gen_4.wildledger.sightings.models.Sighting;

public class SightingDtoConversor {
    
    public static SightingDto toSightingDto(Sighting sighting, Individual individual) {
        boolean hasIndividual;

        if (individual == null) {
            individual = sighting.getIndividual();
        }

        hasIndividual = individual != null;
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
            .reporter(Optional.ofNullable(sighting.getReporter()).map(User::getUsername).orElse(null))
            .hasIndividual(hasIndividual);

        if (sighting.getUpdatedAt() != null) {
            builder.updatedAt(Optional.ofNullable(LocalDateTime.ofInstant(
                sighting.getUpdatedAt().toInstant(), ZoneId.of("UTC")
            )));
        }

        if (hasIndividual) {
            builder
                .individualReporter(Optional.ofNullable(individual.getReporter()).map(User::getUsername))
                .individualId(Optional.of(individual.getId()))
                .name(Optional.ofNullable(individual.getName()))
                .species(Optional.ofNullable(individual.getSpecies()))
                .individualCreatedAt(Optional.of(LocalDateTime.ofInstant(
                    individual.getCreatedAt().toInstant(), ZoneId.of("UTC")
                )));
            
            if (individual.getUpdatedAt() != null) {
                builder.individualUpdatedAt(Optional.ofNullable(LocalDateTime.ofInstant(
                    individual.getUpdatedAt().toInstant(), ZoneId.of("UTC")
                )));
            }

        }

        return builder.build();
    }

}
