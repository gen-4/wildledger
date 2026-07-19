package com.gen_4.wildledger.sightings.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gen_4.wildledger.sightings.models.Sighting;

public interface SightingRepository extends JpaRepository<Sighting, Long> {}