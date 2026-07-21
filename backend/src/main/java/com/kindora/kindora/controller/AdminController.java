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
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalDonations = donationRepository.count();
            long totalUsers = userRepository.countByRole(Role.DONOR);
            long totalNgos = ngoRepository.count();
            long completedDonations = donationRepository.countByStatus(DonationStatus.COMPLETED); // Real metric

            List<com.kindora.kindora.entity.Donation> allDonations = donationRepository.findAll();

            Map<String, Long> categoryCounts = allDonations.stream()
                    .filter(d -> d.getCategory() != null)
                    .collect(java.util.stream.Collectors.groupingBy(com.kindora.kindora.entity.Donation::getCategory,
                            java.util.stream.Collectors.counting()));

            List<Map<String, Object>> realCategoryStats = categoryCounts.entrySet().stream()
                    .map(e -> Map.<String, Object>of("name", e.getKey(), "value", e.getValue()))
                    .collect(java.util.stream.Collectors.toList());

            if (realCategoryStats.isEmpty()) {
                realCategoryStats = Arrays.asList(Map.of("name", "No Data", "value", 100));
            }

            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("d MMM");
            Map<String, Long> dateCounts = allDonations.stream()
                    .filter(d -> d.getCreatedAt() != null)
                    .collect(java.util.stream.Collectors.groupingBy(d -> d.getCreatedAt().format(formatter),
                            java.util.stream.Collectors.counting()));

            List<Map<String, Object>> realMonthlyStats = dateCounts.entrySet().stream()
                    .map(e -> Map.<String, Object>of("date", e.getKey(), "donations", e.getValue()))
                    .collect(java.util.stream.Collectors.toList());

            List<com.kindora.kindora.entity.User> recentUsers = null;
            try {
                recentUsers = userRepository.findTop4ByOrderByCreatedAtDesc();
            } catch (Exception ex) {
                System.err.println("Error fetching recent users: " + ex.getMessage());
            }

            DashboardStats stats = DashboardStats.builder()
                    .totalDonations(totalDonations)
                    .totalUsers(totalUsers)
                    .totalNgos(totalNgos)
                    .completedDonations(completedDonations)
                    .recentDonations(donationRepository.findTop4ByOrderByCreatedAtDesc())
                    .recentUsers(recentUsers)
                    .donationCategoryStats(realCategoryStats)
                    .monthlyDonationStats(realMonthlyStats)
                    .build();

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage(), "type", e.getClass().getName()));
        }
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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        java.io.StringWriter sw = new java.io.StringWriter();
        e.printStackTrace(new java.io.PrintWriter(sw));
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage(), "stackTrace", sw.toString()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> allUsers = new java.util.ArrayList<>();
        
        userRepository.findAll().forEach(user -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("role", user.getRole().name());
            map.put("createdAt", user.getCreatedAt());
            
            if (user.getRole() == Role.DONOR) {
                long count = donationRepository.findByDonorId(user.getId()).size();
                map.put("donationsCount", count);
            } else {
                map.put("donationsCount", 0);
            }
            
            allUsers.add(map);
        });

        ngoRepository.findAll().forEach(ngo -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", ngo.getId());
            map.put("name", ngo.getOrganizationName());
            map.put("email", ngo.getEmail());
            map.put("role", "NGO");
            map.put("createdAt", ngo.getCreatedAt());
            
            long accepted = donationRepository.findByNgoId(ngo.getId()).size();
            map.put("donationsCount", accepted);
            
            allUsers.add(map);
        });
        
        return ResponseEntity.ok(allUsers);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/donations")
    public ResponseEntity<List<com.kindora.kindora.entity.Donation>> getAllDonations() {
        return ResponseEntity.ok(donationRepository.findAll());
    }
}
