package com.kindora.kindora.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "ngos")
public class NGO {
    @Id
    private String id;
    
    @NotBlank(message = "Organization name cannot be empty")
    private String organizationName;
    
    @NotBlank(message = "Registration number cannot be empty")
    private String registrationNumber;
    
    @NotBlank(message = "Registration type cannot be empty")
    private String registrationType;
    
    private String registrationDate;
    
    @NotBlank(message = "Address cannot be empty")
    private String address;
    
    @NotBlank(message = "City cannot be empty")
    private String city;
    
    @NotBlank(message = "State cannot be empty")
    private String state;
    
    @NotBlank(message = "Pincode cannot be empty")
    private String pincode;
    
    @NotBlank(message = "Authorized person name cannot be empty")
    private String authorizedPersonName;
    
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Mobile number cannot be empty")
    private String mobileNumber;
    
    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    private String registrationCertificate;
    private String panCard;
    private String addressProof;
    private String idProof;
    
    private String rejectionReason;
    private String verifiedBy;
    private LocalDateTime verifiedDate;
    
    private NgoStatus status;
    private LocalDateTime createdAt;
    
    private Double latitude;
    private Double longitude;
    
    private String fullAddress;
    private String district;
    private String country;
}
