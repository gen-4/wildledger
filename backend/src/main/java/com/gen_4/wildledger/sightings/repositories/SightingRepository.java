package com.gen_4.wildledger.sightings.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gen_4.wildledger.sightings.models.Sighting;
import com.gen_4.wildledger.sightings.models.SightingProxy;

public interface SightingRepository extends JpaRepository<Sighting, Long> {

    @Query("""
        SELECT new com.gen_4.wildledger.sightings.models.SightingProxy(
            s.id,
            i.id,
            i.name,
            s.latitude,
            s.longitude,
            s.imagePath
        )
        FROM Sighting s
        LEFT JOIN s.individual i
    """)
    public List<SightingProxy> findAllWithIndividual();
    
}