package com.kindora.kindora.controller;

import com.kindora.kindora.entity.Donation;
import com.kindora.kindora.entity.DonationStatus;
import com.kindora.kindora.entity.User;
import com.kindora.kindora.repository.DonationRepository;
import com.kindora.kindora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import com.kindora.kindora.dto.DonorDashboardStats;

@RestController
@RequestMapping("/donor")
@RequiredArgsConstructor
public class DonorController {

    private final DonationRepository donationRepository;
    private final com.kindora.kindora.repository.DonationProofRepository donationProofRepository;
    private final UserRepository userRepository;

    @PostMapping("/donation")
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        donation.setStatus(DonationStatus.PENDING);
        donation.setCreatedAt(LocalDateTime.now());
        
        userRepository.findById(donation.getDonorId()).ifPresent(user -> {
            donation.setDonorName(user.getName());
        });
        
        return ResponseEntity.ok(donationRepository.save(donation));
    }

    @GetMapping("/donation/{id}")
    public ResponseEntity<Donation> getDonation(@PathVariable String id) {
        return donationRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/donation/{id}/cancel")
    public ResponseEntity<Donation> cancelDonation(@PathVariable String id) {
        return donationRepository.findById(id).map(donation -> {
            donation.setStatus(DonationStatus.CANCELLED);
            return ResponseEntity.ok(donationRepository.save(donation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/history/{donorId}")
    public ResponseEntity<List<Donation>> getHistory(@PathVariable String donorId) {
        return ResponseEntity.ok(donationRepository.findByDonorId(donorId));
    }

    @GetMapping("/dashboard-stats/{donorId}")
    public ResponseEntity<DonorDashboardStats> getDashboardStats(@PathVariable String donorId) {
        List<Donation> history = donationRepository.findByDonorId(donorId);
        long totalDonations = history.size();
        long pendingPickups = history.stream().filter(d -> d.getStatus() == DonationStatus.PENDING).count();
        long acceptedPickups = history.stream().filter(d -> d.getStatus() == DonationStatus.ACCEPTED || d.getStatus() == DonationStatus.SCHEDULED).count();
        long impactScore = totalDonations * 50;

        DonorDashboardStats stats = DonorDashboardStats.builder()
            .totalDonations(totalDonations)
            .pendingPickups(pendingPickups)
            .acceptedPickups(acceptedPickups)
            .impactScore(impactScore)
            .build();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/donations/{id}/proof")
    public ResponseEntity<com.kindora.kindora.entity.DonationProof> getDonationProof(@PathVariable String id) {
        return donationProofRepository.findByDonationId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable String id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setPhone(updatedUser.getPhone());
            user.setAddress(updatedUser.getAddress());
            user.setFullAddress(updatedUser.getFullAddress());
            user.setCity(updatedUser.getCity());
            user.setDistrict(updatedUser.getDistrict());
            user.setState(updatedUser.getState());
            user.setCountry(updatedUser.getCountry());
            user.setPincode(updatedUser.getPincode());
            user.setLatitude(updatedUser.getLatitude());
            user.setLongitude(updatedUser.getLongitude());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }
}
