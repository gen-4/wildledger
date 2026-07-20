package com.gen_4.wildledger.auth.dtos.conversors;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import com.gen_4.wildledger.auth.dtos.UserDto;
import com.gen_4.wildledger.auth.dtos.RoleDto;
import com.gen_4.wildledger.auth.models.User;

public class UserDtoConversor {
    
    public static UserDto toUserDto(User user) {
        var builder = UserDto.builder();
        builder
            .id(user.getId())
            .username(user.getUsername())
            .registerDate(LocalDateTime.ofInstant(user.getRegisterDate().toInstant(), ZoneId.of("UTC")))
            .updatedAt(LocalDateTime.ofInstant(user.getUpdatedAt().toInstant(), ZoneId.of("UTC")))
            .roles(user.getRoles().stream().map(role -> 
                RoleDto.builder()
                    .id(role.getId())
                    .role(role.getRole().name())
                    .build()
            ).toList());

        if (user.getLastLogin() != null) {
            builder.lastLogin(Optional.ofNullable(
                LocalDateTime.ofInstant(user.getLastLogin().toInstant(), ZoneId.of("UTC"))
            ));
        }

        return builder.build();
    }
    
}
