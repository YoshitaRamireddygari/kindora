package com.kindora.kindora.repository;

import com.kindora.kindora.entity.Pickup;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PickupRepository extends MongoRepository<Pickup, String> {
    List<Pickup> findByDonationId(String donationId);
}
