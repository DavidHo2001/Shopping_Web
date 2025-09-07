package com.shopping.controller;

//import com.shopping.model.AdminProduct;
//import com.shopping.repository.AdminProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
public class AdminProductController {
    //@Autowired
    //private AdminProductRepository AdminProductRepository;

    @GetMapping("/product-test")
    public ResponseEntity<String> productTest() {
        return ResponseEntity.ok("Your role is admin");
    }
}
