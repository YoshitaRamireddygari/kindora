package com.kindora.kindora.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "system_settings")
public class SystemSettings {
    @Id
    private String id;
    
    private boolean allowNgoRegistrations;
    private boolean maintenanceMode;
    private boolean sendDailyDigest;
    private boolean alertOnNewNgo;
    
    private LocalDateTime updatedAt;
}
