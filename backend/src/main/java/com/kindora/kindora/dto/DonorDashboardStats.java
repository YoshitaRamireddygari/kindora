package com.kindora.kindora.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DonorDashboardStats {
    private long totalDonations;
    private long pendingPickups;
    private long acceptedPickups;
    private long impactScore;
}
