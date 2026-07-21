package com.kindora.kindora.controller;

import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;
import com.kindora.kindora.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/ngo")
@RequiredArgsConstructor
public class NgoController {

    private final NgoRepository ngoRepository;

    @PostMapping("/register")
    public ResponseEntity<NGO> register(@RequestBody NGO ngo) {
        ngo.setStatus(NgoStatus.PENDING);
        ngo.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(ngoRepository.save(ngo));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<NGO> getProfile(@PathVariable String id) {
        return ngoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
