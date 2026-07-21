package com.kindora.kindora.controller;

import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;
import com.kindora.kindora.entity.Role;
import com.kindora.kindora.entity.DonationStatus;
import com.kindora.kindora.repository.NgoRepository;
import com.kindora.kindora.repository.UserRepository;
import com.kindora.kindora.repository.DonationRepository;
import com.kindora.kindora.dto.DashboardStats;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        long totalDonations = donationRepository.count();
        long totalUsers = userRepository.countByRole(Role.DONOR);
        long totalNgos = ngoRepository.count();
        long completedDonations = donationRepository.countByStatus(DonationStatus.ACCEPTED); // Simplified for MVP

        List<Map<String, Object>> mockCategoryStats = Arrays.asList(
            Map.of("name", "Food", "value", 40),
            Map.of("name", "Clothes", "value", 30),
            Map.of("name", "Books", "value", 15),
            Map.of("name", "Toys", "value", 10),
            Map.of("name", "Others", "value", 5)
        );

        List<Map<String, Object>> mockMonthlyStats = Arrays.asList(
            Map.of("date", "1 May", "donations", 20),
            Map.of("date", "6 May", "donations", 50),
            Map.of("date", "11 May", "donations", 40),
            Map.of("date", "16 May", "donations", 80),
            Map.of("date", "21 May", "donations", 40),
            Map.of("date", "26 May", "donations", 65),
            Map.of("date", "31 May", "donations", 100)
        );

        DashboardStats stats = DashboardStats.builder()
            .totalDonations(totalDonations)
            .totalUsers(totalUsers)
            .totalNgos(totalNgos)
            .completedDonations(completedDonations)
            .recentDonations(donationRepository.findTop4ByOrderByCreatedAtDesc())
            .recentUsers(userRepository.findTop4ByOrderByCreatedAtDesc())
            .donationCategoryStats(mockCategoryStats)
            .monthlyDonationStats(mockMonthlyStats)
            .build();
            
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/ngos/pending")
    public ResponseEntity<List<NGO>> getPendingNgos() {
        return ResponseEntity.ok(ngoRepository.findByStatus(NgoStatus.PENDING));
    }

    @PostMapping("/ngos/{id}/approve")
    public ResponseEntity<?> approveNgo(@PathVariable String id) {
        return ngoRepository.findById(id).map(ngo -> {
            ngo.setStatus(NgoStatus.VERIFIED);
            ngo.setVerifiedDate(LocalDateTime.now());
            ngo.setVerifiedBy("Admin");
            ngoRepository.save(ngo);
            
            // Simulate sending email
            System.out.println("=================================================");
            System.out.println("EMAIL SENT TO: " + ngo.getEmail());
            System.out.println("SUBJECT: Account Verified - Welcome to Kindora!");
            System.out.println("BODY: Your NGO registration has been approved.");
            System.out.println("=================================================");
            
            return ResponseEntity.ok(Map.of("message", "NGO approved successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ngos/{id}/reject")
    public ResponseEntity<?> rejectNgo(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String reason = payload.get("reason");
        return ngoRepository.findById(id).map(ngo -> {
            ngo.setStatus(NgoStatus.REJECTED);
            ngo.setRejectionReason(reason);
            ngoRepository.save(ngo);
            
            // Simulate sending email
            System.out.println("=================================================");
            System.out.println("EMAIL SENT TO: " + ngo.getEmail());
            System.out.println("SUBJECT: Account Verification Failed");
            System.out.println("BODY: Your NGO registration was rejected. Reason: " + reason);
            System.out.println("=================================================");
            
            return ResponseEntity.ok(Map.of("message", "NGO rejected successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
