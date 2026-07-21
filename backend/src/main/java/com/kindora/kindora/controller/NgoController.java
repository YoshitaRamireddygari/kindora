package com.kindora.kindora.controller;

import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;
import com.kindora.kindora.entity.Donation;
import com.kindora.kindora.entity.DonationStatus;
import com.kindora.kindora.repository.NgoRepository;
import com.kindora.kindora.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ngo")
@RequiredArgsConstructor
public class NgoController {

    private final NgoRepository ngoRepository;
    private final DonationRepository donationRepository;

    @PostMapping("/register")
    public ResponseEntity<NGO> register(@Valid @RequestBody NGO ngo) {
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

    @GetMapping("/donations/pending")
    public ResponseEntity<List<Donation>> getPendingDonations() {
        return ResponseEntity.ok(donationRepository.findByStatus(DonationStatus.PENDING));
    }

    @GetMapping("/donations/accepted/{ngoId}")
    public ResponseEntity<List<Donation>> getAcceptedDonations(@PathVariable String ngoId) {
        return ResponseEntity.ok(donationRepository.findByNgoId(ngoId));
    }

    @PostMapping("/donations/{id}/accept")
    public ResponseEntity<Donation> acceptDonation(@PathVariable String id, @RequestParam String ngoId) {
        return donationRepository.findById(id).map(donation -> {
            donation.setStatus(DonationStatus.ACCEPTED);
            donation.setNgoId(ngoId);
            return ResponseEntity.ok(donationRepository.save(donation));
        }).orElse(ResponseEntity.notFound().build());
    }
}
