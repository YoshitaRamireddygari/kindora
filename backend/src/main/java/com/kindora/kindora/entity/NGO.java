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
@Document(collection = "ngos")
public class NGO {
    @Id
    private String id;
    private String organizationName;
    private String registrationNumber;
    private String licenseNumber;
    private String email;
    private String phone;
    private String address;
    private List<String> documents;
    private NgoStatus status;
    private LocalDateTime createdAt;
}
