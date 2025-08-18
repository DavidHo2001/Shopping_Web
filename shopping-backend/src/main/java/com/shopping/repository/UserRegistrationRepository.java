package com.shopping.repository;

import com.shopping.model.UserRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRegistrationRepository extends JpaRepository<UserRegistration, Long> {
    Optional<UserRegistration> findByEmail(String email);
    boolean existsByEmail(String email);
} 