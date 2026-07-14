package com.gen_4.wildledger.auth.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gen_4.wildledger.auth.models.User;



public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndIsEnabledAndIsBanned(String username, Boolean isEnabled, Boolean isBanned);

    boolean existsByUsername(String username);

}
