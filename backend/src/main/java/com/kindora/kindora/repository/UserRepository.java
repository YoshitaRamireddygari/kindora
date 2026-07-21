package com.kindora.kindora.repository;

import com.kindora.kindora.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;
import com.kindora.kindora.entity.Role;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findTop4ByOrderByCreatedAtDesc();
    long countByRole(Role role);
}
