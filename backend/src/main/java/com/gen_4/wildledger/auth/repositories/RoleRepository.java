package com.gen_4.wildledger.auth.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gen_4.wildledger.auth.models.Role;
import com.gen_4.wildledger.auth.models.RoleOptions;


public interface RoleRepository extends JpaRepository<Role, Long> {

    public Optional<Role> findByRole(RoleOptions role);
    
}
