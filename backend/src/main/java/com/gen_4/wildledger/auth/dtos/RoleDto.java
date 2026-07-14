package com.gen_4.wildledger.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class RoleDto {
    
    Long id;

    String role;

}
