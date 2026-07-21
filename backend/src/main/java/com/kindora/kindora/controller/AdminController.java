package com.kindora.kindora.controller;

import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;
import com.kindora.kindora.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final NgoRepository ngoRepository;

    @GetMapping("/ngos")
    public ResponseEntity<List<NGO>> getAllNgos() {
        return ResponseEntity.ok(ngoRepository.findAll());
    }

    @PutMapping("/verify/{id}")
    public ResponseEntity<NGO> verifyNgo(@PathVariable String id) {
        return ngoRepository.findById(id).map(ngo -> {
            ngo.setStatus(NgoStatus.APPROVED);
            return ResponseEntity.ok(ngoRepository.save(ngo));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<NGO> rejectNgo(@PathVariable String id) {
        return ngoRepository.findById(id).map(ngo -> {
            ngo.setStatus(NgoStatus.REJECTED);
            return ResponseEntity.ok(ngoRepository.save(ngo));
        }).orElse(ResponseEntity.notFound().build());
    }
}
