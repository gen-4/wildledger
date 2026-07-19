package com.gen_4.wildledger.sightings.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gen_4.wildledger.sightings.models.Individual;

public interface IndividualRepository extends JpaRepository<Individual, Long> {}
