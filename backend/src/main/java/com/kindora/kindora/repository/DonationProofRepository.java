package com.kindora.kindora.repository;

import com.kindora.kindora.entity.DonationProof;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonationProofRepository extends MongoRepository<DonationProof, String> {
    Optional<DonationProof> findByDonationId(String donationId);
}
