package com.kindora.kindora.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class NgoDashboardStats {
    private long totalRequests;
    private long acceptedDonations;
    private long itemsReceived;
    private long beneficiariesHelped;
    private List<Map<String, Object>> recentActivity;
    private List<Map<String, Object>> donationOverview;
}
