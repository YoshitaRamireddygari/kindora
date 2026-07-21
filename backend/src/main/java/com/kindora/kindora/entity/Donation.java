package com.kindora.kindora.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "donations")
public class Donation {
    @Id
    private String id;
    private String donorId;
    private String ngoId;
    private String category;
    private String description;
    private String quantity;
    private String pickupAddress;
    private LocalDate pickupDate;
    private DonationStatus status;
    private LocalDateTime createdAt;
}
