package com.kindora.kindora.controller;

import com.kindora.kindora.entity.SystemSettings;
import com.kindora.kindora.repository.SystemSettingsRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SystemSettingsController {

    private final SystemSettingsRepository systemSettingsRepository;

    @PostConstruct
    public void initSettings() {
        if (systemSettingsRepository.count() == 0) {
            SystemSettings defaultSettings = SystemSettings.builder()
                .allowNgoRegistrations(true)
                .maintenanceMode(false)
                .sendDailyDigest(true)
                .alertOnNewNgo(true)
                .updatedAt(LocalDateTime.now())
                .build();
            systemSettingsRepository.save(defaultSettings);
        }
    }

    @GetMapping
    public ResponseEntity<SystemSettings> getSettings() {
        List<SystemSettings> settings = systemSettingsRepository.findAll();
        if (!settings.isEmpty()) {
            return ResponseEntity.ok(settings.get(0));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<SystemSettings> updateSettings(@RequestBody SystemSettings updatedSettings) {
        List<SystemSettings> settings = systemSettingsRepository.findAll();
        if (!settings.isEmpty()) {
            SystemSettings existing = settings.get(0);
            existing.setAllowNgoRegistrations(updatedSettings.isAllowNgoRegistrations());
            existing.setMaintenanceMode(updatedSettings.isMaintenanceMode());
            existing.setSendDailyDigest(updatedSettings.isSendDailyDigest());
            existing.setAlertOnNewNgo(updatedSettings.isAlertOnNewNgo());
            existing.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(systemSettingsRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }
}
