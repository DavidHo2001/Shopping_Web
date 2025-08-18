package com.shopping.config;

//import JwtAuthenticationFilter(check if user is logged in and with permissions)
import com.shopping.filter.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

import java.util.Arrays;

/**
 * Spring Security Configuration for Shopping Backend Application
 * This configuration handles authentication, authorization, and CORS settings
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Bean for password encoding using BCrypt algorithm
     * BCrypt is a strong hashing function designed for password hashing
     * 
     * @return BCryptPasswordEncoder instance for password hashing
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the security filter chain for HTTP requests
     * Defines which endpoints are public and which require authentication
     * 
     * @param http HttpSecurity object to configure security settings
     * @return SecurityFilterChain configured security filter chain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable Cross-Origin Resource Sharing (CORS) with custom configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable Cross-Site Request Forgery (CSRF) protection for REST API endpoints
            // CSRF is not needed for stateless REST APIs
            .csrf(csrf -> csrf.disable())
            
            // Add JWT authentication filter (right before all the authentication filters)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            
            // Configure authorization rules for different endpoints
            .authorizeHttpRequests(auth -> auth
                // Require JWT for these endpoints
                .requestMatchers("/api/cart/**", "/api/checkout/**", "/api/profile/**").authenticated()
                // All other requests are public
                .anyRequest().permitAll()
            )
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        return http.build();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) settings
     * Allows the frontend application to make requests to the backend API
     * 
     * @return CorsConfigurationSource configured CORS settings
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow requests from the frontend application (localhost development)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        
        // Allow all standard HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow all headers in requests
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (cookies, authorization headers) to be sent
        configuration.setAllowCredentials(true);
        
        // Apply CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 