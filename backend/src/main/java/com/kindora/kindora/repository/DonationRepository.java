package com.kindora.kindora.repository;

import com.kindora.kindora.entity.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByDonorId(String donorId);
    List<Donation> findByNgoId(String ngoId);
}
