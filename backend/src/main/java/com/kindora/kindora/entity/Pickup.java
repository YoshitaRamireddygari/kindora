package com.kindora.kindora.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "pickups")
public class Pickup {
    @Id
    private String id;
    private String donationId;
    private LocalDate pickupDate;
    private LocalTime pickupTime;
    private String driverName;
    private PickupStatus status;
}
