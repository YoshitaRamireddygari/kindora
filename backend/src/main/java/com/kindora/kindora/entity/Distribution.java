package com.kindora.kindora.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "distributions")
public class Distribution {
    @Id
    private String id;
    private String donationId;
    private String trustName;
    private String location;
    private LocalDate distributedDate;
    private String remarks;
}
