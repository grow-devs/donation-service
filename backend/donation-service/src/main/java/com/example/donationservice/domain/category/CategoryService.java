package com.example.donationservice.domain.category;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public interface CategoryService {
    void create(String name);
}
