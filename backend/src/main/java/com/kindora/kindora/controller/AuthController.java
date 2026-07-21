package com.kindora.kindora.controller;

import com.kindora.kindora.dto.AuthRequest;
import com.kindora.kindora.entity.User;
import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;
import com.kindora.kindora.repository.UserRepository;
import com.kindora.kindora.repository.NgoRepository;
import com.kindora.kindora.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // 1. Check if user is a standard User (Donor / Admin)
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent() && userOptional.get().getPassword().equals(request.getPassword())) {
            String token = jwtUtil.generateToken(request.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userOptional.get());
            return ResponseEntity.ok(response);
        }

        // 2. Check if user is an NGO
        Optional<NGO> ngoOptional = ngoRepository.findByEmail(request.getEmail());
        if (ngoOptional.isPresent() && ngoOptional.get().getPassword().equals(request.getPassword())) {
            NGO ngo = ngoOptional.get();
            
            if (ngo.getStatus() == NgoStatus.PENDING) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Your account is pending admin verification."));
            }
            if (ngo.getStatus() == NgoStatus.REJECTED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Registration rejected: " + ngo.getRejectionReason()));
            }

            // Status is VERIFIED, allow login
            String token = jwtUtil.generateToken(request.getEmail());
            Map<String, Object> response = new HashMap<>();
            
            // Map NGO fields to a standard user object shape for the frontend
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", ngo.getId());
            userData.put("name", ngo.getOrganizationName());
            userData.put("email", ngo.getEmail());
            userData.put("role", "NGO");
            
            response.put("token", token);
            response.put("user", userData);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        user.setCreatedAt(java.time.LocalDateTime.now());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
