package com.kindora.kindora.repository;

import com.kindora.kindora.entity.Distribution;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DistributionRepository extends MongoRepository<Distribution, String> {
    List<Distribution> findByDonationId(String donationId);
}
