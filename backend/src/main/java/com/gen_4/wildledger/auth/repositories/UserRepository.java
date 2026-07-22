package com.gen_4.wildledger.auth.repositories;

import java.sql.Timestamp;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gen_4.wildledger.auth.models.User;



public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndIsEnabledAndIsBanned(String username, Boolean isEnabled, Boolean isBanned);

    boolean existsByUsername(String username);

    @Modifying
    @Query("UPDATE User u SET u.lastLogin = :lastLogin WHERE u.id = :id")
    void updateLastLogin(@Param("id") long id, @Param("lastLogin") Timestamp lastLogin);

}
