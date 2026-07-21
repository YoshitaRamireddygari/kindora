package com.kindora.kindora.controller;

import com.kindora.kindora.dto.AuthRequest;
import com.kindora.kindora.entity.User;
import com.kindora.kindora.repository.UserRepository;
import com.kindora.kindora.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent() && userOptional.get().getPassword().equals(request.getPassword())) {
            String token = jwtUtil.generateToken(request.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userOptional.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        user.setCreatedAt(java.time.LocalDateTime.now());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
