package com.kindora.kindora.dto;

import com.kindora.kindora.entity.Donation;
import com.kindora.kindora.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalDonations;
    private long totalUsers;
    private long totalNgos;
    private long completedDonations;
    private List<Donation> recentDonations;
    private List<User> recentUsers;
    private List<Map<String, Object>> donationCategoryStats; // Mocked for now
    private List<Map<String, Object>> monthlyDonationStats;  // Mocked for now
}
