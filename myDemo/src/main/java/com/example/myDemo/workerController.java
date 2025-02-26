package com.example.myDemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class workerController {
	
    @Autowired
    private workerService workerService;

    @GetMapping("/worker")
    public worker getFirstWorker() {
        // Fetch the first worker from the service
        worker worker = workerService.getFirstWorker();
        
        // Return the worker object, or return null if no worker is found
        if (worker != null) {
            return worker;
        } else {
            // Return a message or empty response if no worker is found
            return null;  // You can also customize this to return an appropriate message
        }
        
    }

}
