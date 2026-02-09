package com.shopping.dto.request;
import lombok.Data;

@Data
public class UserRoleRequest {
    private Long userId;
    private Integer roleId;
    private Boolean isBlocked;
}