package com.gen_4.wildledger.auth.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@Data
@AllArgsConstructor
@Builder
public class UserDto {

    private long id;

	private String username;

	private LocalDateTime registerDate;

	private Optional<LocalDateTime> lastLogin;

    private LocalDateTime updatedAt;

    private List<RoleDto> roles;
    
}
