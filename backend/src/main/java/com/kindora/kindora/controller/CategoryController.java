package com.kindora.kindora.controller;

import com.kindora.kindora.entity.Category;
import com.kindora.kindora.repository.CategoryRepository;
import com.kindora.kindora.repository.DonationRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final DonationRepository donationRepository;

    @PostConstruct
    public void initDefaultCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> defaults = List.of(
                Category.builder().name("Food").status("Active").count(0).createdAt(LocalDateTime.now()).build(),
                Category.builder().name("Clothes").status("Active").count(0).createdAt(LocalDateTime.now()).build(),
                Category.builder().name("Books").status("Active").count(0).createdAt(LocalDateTime.now()).build(),
                Category.builder().name("Toys").status("Active").count(0).createdAt(LocalDateTime.now()).build(),
                Category.builder().name("Others").status("Active").count(0).createdAt(LocalDateTime.now()).build()
            );
            categoryRepository.saveAll(defaults);
        }
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<com.kindora.kindora.entity.Donation> allDonations = donationRepository.findAll();
        
        for (Category cat : categories) {
            long count = allDonations.stream()
                .filter(d -> cat.getName().equalsIgnoreCase(d.getCategory()))
                .count();
            cat.setCount(count);
        }
        
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        category.setCreatedAt(LocalDateTime.now());
        if (category.getStatus() == null) {
            category.setStatus("Active");
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        return categoryRepository.findById(id).map(category -> {
            categoryRepository.delete(category);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
