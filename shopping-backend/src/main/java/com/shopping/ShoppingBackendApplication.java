package com.shopping;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShoppingBackendApplication {

	public static void main(String[] args) {
		
		SpringApplication.run(ShoppingBackendApplication.class, args);
		
		// This will print after the server starts
		System.out.println("Shopping Backend is now running!");
		System.out.println("Visit: localhost");
	}

}
