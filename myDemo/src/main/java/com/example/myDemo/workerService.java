package com.example.myDemo;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class workerService {
    
    @Autowired
    private workerRepository workerRepository;

    // Method to fetch the first worker from the database
    public worker getFirstWorker() {
        List<worker> workers = workerRepository.findAll();
        return workers.stream().findFirst().orElse(null);  // Return the first worker or null if none exist
    }

    // Additional service methods as needed
}