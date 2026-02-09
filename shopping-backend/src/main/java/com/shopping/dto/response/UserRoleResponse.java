package com.shopping.dto.response;

import lombok.Data;
import lombok.AllArgsConstructor;
@Data
@AllArgsConstructor
public class UserRoleResponse {
    private Long id;
    private String username;
    private String role;
    private Integer roleId;
    private Boolean isBlocked;
}
