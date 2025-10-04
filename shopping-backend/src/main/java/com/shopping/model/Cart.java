package com.shopping.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.util.Date;

@Entity
@Table(name = "cart")
public class Cart {
    @Id
    private Long userId;
    @Column(nullable = true)
    private String productList;

    //Getters and Setters
    public Long getUserId() {return userId;}
    public void setUserId(Long userId) {this.userId = userId;}
    public String getProductList() {return productList;}
    public void setProductList(String productList) {this.productList = productList;}
}