package com.shopping.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private String image;
    private String brand;
    private String category;
    private int quantity;
}
