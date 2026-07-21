package com.kindora.kindora.repository;

import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NgoRepository extends MongoRepository<NGO, String> {
    Optional<NGO> findByEmail(String email);
    List<NGO> findByStatus(NgoStatus status);
}
