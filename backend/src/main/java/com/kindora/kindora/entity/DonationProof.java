package com.kindora.kindora.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "donation_proofs")
public class DonationProof {
    @Id
    private String id;
    
    private String donationId;
    private String ngoId;
    private List<String> photos; // Base64 or URLs
    private String description;
    private String distributionDate;
    
    private LocalDateTime uploadedAt;
    private String approvedByAdmin;
    private String remarks;
    
    private ProofStatus status;
    
    private Double distributionLatitude;
    private Double distributionLongitude;
    private String distributionAddress;
    
    private String distributionFullAddress;
    private String distributionCity;
    private String distributionDistrict;
    private String distributionState;
    private String distributionCountry;
    private String distributionPincode;
}
