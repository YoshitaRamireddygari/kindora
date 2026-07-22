package com.kindora.kindora.controller;

import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;
import com.kindora.kindora.entity.Donation;
import com.kindora.kindora.entity.DonationStatus;
import com.kindora.kindora.repository.NgoRepository;
import com.kindora.kindora.repository.DonationRepository;
import com.kindora.kindora.repository.SystemSettingsRepository;
import com.kindora.kindora.entity.SystemSettings;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import com.kindora.kindora.dto.NgoDashboardStats;

@RestController
@RequestMapping("/ngo")
@RequiredArgsConstructor
public class NgoController {

    private final NgoRepository ngoRepository;
    private final DonationRepository donationRepository;
    private final com.kindora.kindora.repository.DonationProofRepository donationProofRepository;
    private final SystemSettingsRepository systemSettingsRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody NGO ngo) {
        List<SystemSettings> settings = systemSettingsRepository.findAll();
        if (!settings.isEmpty() && !settings.get(0).isAllowNgoRegistrations()) {
            return ResponseEntity.badRequest().body(Map.of("message", "THE NGO REGISTARATIONS has to be allowed or else regrations were not opened"));
        }

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

    @PutMapping("/profile/{id}")
    public ResponseEntity<NGO> updateProfile(@PathVariable String id, @RequestBody NGO updatedNgo) {
        return ngoRepository.findById(id).map(ngo -> {
            ngo.setOrganizationName(updatedNgo.getOrganizationName());
            ngo.setAuthorizedPersonName(updatedNgo.getAuthorizedPersonName());
            ngo.setMobileNumber(updatedNgo.getMobileNumber());
            ngo.setAddress(updatedNgo.getAddress());
            return ResponseEntity.ok(ngoRepository.save(ngo));
        }).orElse(ResponseEntity.notFound().build());
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

    @GetMapping("/dashboard-stats/{ngoId}")
    public ResponseEntity<NgoDashboardStats> getDashboardStats(@PathVariable String ngoId) {
        long totalRequests = donationRepository.findByStatus(DonationStatus.PENDING).size();
        List<Donation> accepted = donationRepository.findByNgoId(ngoId);
        long acceptedCount = accepted.stream().filter(d -> d.getStatus() == DonationStatus.ACCEPTED || d.getStatus() == DonationStatus.SCHEDULED || d.getStatus() == DonationStatus.PICKED_UP).count();
        long itemsReceived = accepted.stream().filter(d -> d.getStatus() == DonationStatus.COMPLETED).count();
        long beneficiariesHelped = itemsReceived * 5; // Mock metric

        List<Map<String, Object>> mockRecentActivity = Arrays.asList(
            Map.of("text", "Rice donation request accepted", "time", "2 mins ago", "bg", "bg-purple-100"),
            Map.of("text", "Blankets donation received", "time", "1 hour ago", "bg", "bg-teal-100")
        );

        List<Map<String, Object>> mockDonationOverview = Arrays.asList(
            Map.of("name", "Pending", "value", totalRequests),
            Map.of("name", "Accepted", "value", acceptedCount),
            Map.of("name", "Completed", "value", itemsReceived)
        );

        NgoDashboardStats stats = NgoDashboardStats.builder()
            .totalRequests(totalRequests)
            .acceptedDonations(acceptedCount)
            .itemsReceived(itemsReceived)
            .beneficiariesHelped(beneficiariesHelped)
            .recentActivity(mockRecentActivity)
            .donationOverview(mockDonationOverview)
            .build();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/inventory/{ngoId}")
    public ResponseEntity<List<Donation>> getInventory(@PathVariable String ngoId) {
        // Return completed donations as inventory
        List<Donation> inventory = donationRepository.findByNgoId(ngoId).stream()
                .filter(d -> d.getStatus() == DonationStatus.COMPLETED)
                .toList();
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/donations/{id}/status")
    public ResponseEntity<Donation> updateDonationStatus(@PathVariable String id, @RequestParam DonationStatus status) {
        return donationRepository.findById(id).map(donation -> {
            donation.setStatus(status);
            return ResponseEntity.ok(donationRepository.save(donation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/donations/{id}/schedule")
    public ResponseEntity<Donation> schedulePickup(@PathVariable String id, @RequestParam String date) {
        return donationRepository.findById(id).map(donation -> {
            try {
                donation.setPickupDate(java.time.LocalDate.parse(date));
                donation.setStatus(DonationStatus.SCHEDULED);
                return ResponseEntity.ok(donationRepository.save(donation));
            } catch (Exception e) {
                return ResponseEntity.badRequest().<Donation>build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/donations/{id}/upload-proof")
    public ResponseEntity<com.kindora.kindora.entity.DonationProof> uploadProof(
            @PathVariable String id, 
            @RequestBody com.kindora.kindora.entity.DonationProof proof) {
        
        return donationRepository.findById(id).map(donation -> {
            proof.setDonationId(id);
            proof.setNgoId(donation.getNgoId());
            proof.setStatus(com.kindora.kindora.entity.ProofStatus.PENDING);
            proof.setUploadedAt(LocalDateTime.now());
            
            donation.setStatus(DonationStatus.DISTRIBUTION_PROOF_PENDING);
            donationRepository.save(donation);
            
            return ResponseEntity.ok(donationProofRepository.save(proof));
        }).orElse(ResponseEntity.notFound().build());
    }
}
