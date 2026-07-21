package com.kindora.kindora.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "admins")
public class Admin {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role; // Admin role
    private LocalDateTime createdAt;
}
