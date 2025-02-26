package com.example.myDemo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface workerRepository extends JpaRepository<worker, Integer> {
    // You can add custom queries here if needed
}
