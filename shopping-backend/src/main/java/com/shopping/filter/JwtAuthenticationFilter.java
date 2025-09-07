package com.shopping.filter;

import com.shopping.service.JwtService;
import com.shopping.repository.UserRegistrationRepository;
import com.shopping.model.UserRegistration;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

/**
 * JWT Authentication Filter
 * Extracts JWT token from HTTP-only cookies and validates it
 * Sets authentication in SecurityContext if token is valid
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRegistrationRepository userRegistrationRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Extract JWT token from cookies
        String jwt = extractTokenFromCookies(request);

        if (jwt != null && isValidToken(jwt)) {
            // Set authentication in security context
            Authentication auth = createAuthentication(jwt);
            if (auth != null) {
                //no need to manage this manually, Spring Security handles it.
                //each user has their own authentication object(SecurityContext)
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    //Extract JWT token from HTTP cookies
    private String extractTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("authToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    //Validate JWT token
    private boolean isValidToken(String jwt) {
        try {
            String email = jwtService.extractEmail(jwt);
            return jwtService.validateToken(jwt, email);
        } catch (Exception e) {
            return false;
        }
    }

    //Create Authentication object(user info) from JWT token
    private Authentication createAuthentication(String jwt) {
        try {
            String email = jwtService.extractEmail(jwt);
            Long userId = jwtService.extractUserId(jwt);
            Integer role = jwtService.extractRole(jwt);
            
            // Get user from database to ensure they still exist
            Optional<UserRegistration> userOptional = userRegistrationRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                UserRegistration userInfo = userOptional.get();
                // UsernamePasswordAuthenticationToken only takes 3 parameters
                // 1. Principal (user identifier)
                // 2. Credentials (not needed, already authenticated)
                // 3. Authorities (Added Spring Security object)
                // Spring Security Authority
                List<GrantedAuthority> authorities = new ArrayList<>();
                switch (role) {
                    case 1:
                        authorities.add(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
                        break;
                    case 2:
                        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                        break;
                    case 3:
                        authorities.add(new SimpleGrantedAuthority("ROLE_SUPERADMIN"));
                        break;
                    default:
                        authorities.add(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
                }

                Map<String, Object> user = Map.of(
                    "userId", userId,
                    "email", email,
                    "username", userInfo.getUsername(),
                    "firstName", userInfo.getFirstName(),
                    "lastName", userInfo.getLastName(),
                    "phone", userInfo.getPhone(),
                    "role", role //Easy access for frontend to show Admin page
                );
                
                return new UsernamePasswordAuthenticationToken(
                    user, // Principal (user identifier)        
                    null, // Credentials ()
                    authorities // Authorities with proper roles
                );
                
            }
        } catch (Exception e) {
            // Log error but don't throw - just return null to indicate no authentication
            System.err.println("Error creating authentication from JWT: " + e.getMessage());
        }
        return null;
    }
}