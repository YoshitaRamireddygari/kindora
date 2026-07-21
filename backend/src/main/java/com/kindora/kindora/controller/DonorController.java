package com.kindora.kindora.controller;

import com.kindora.kindora.entity.Donation;
import com.kindora.kindora.entity.DonationStatus;
import com.kindora.kindora.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/donor")
@RequiredArgsConstructor
public class DonorController {

    private final DonationRepository donationRepository;

    @PostMapping("/donation")
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        donation.setStatus(DonationStatus.PENDING);
        donation.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(donationRepository.save(donation));
    }

    @GetMapping("/history/{donorId}")
    public ResponseEntity<List<Donation>> getHistory(@PathVariable String donorId) {
        return ResponseEntity.ok(donationRepository.findByDonorId(donorId));
    }
}
