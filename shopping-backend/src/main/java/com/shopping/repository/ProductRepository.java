package com.shopping.repository;

import com.shopping.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // List<Product> findAll() is inherited.

    List<Product> findByCategory(String category);

    //Find category in (Neutral, Men / Women) and sort them by ID.
    List<Product> findByCategoryInOrderById(List<String> categories);

    List<Product> findByBrand(String brand);

    List<Product> findByCategoryAndBrand(String category, String brand);

    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Find products within price range
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice, 
                                   @Param("maxPrice") java.math.BigDecimal maxPrice);

    List<Product> findByCategoryOrderByPriceAsc(String category);

    List<Product> findByCategoryOrderByPriceDesc(String category);
} 