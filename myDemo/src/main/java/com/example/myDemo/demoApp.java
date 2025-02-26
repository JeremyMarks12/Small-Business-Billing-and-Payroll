package com.example.myDemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class demoApp implements CommandLineRunner {

    @Autowired
    private workerService workerService;  // Updated to match class name

    public static void main(String[] args) {
        SpringApplication.run(demoApp.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Fetch the first worker from the database
        worker worker = workerService.getFirstWorker();  // Call service method to fetch the first worker
        
        // Check if a worker exists and print the workerID and workerFName to the console
        if (worker != null) {
            System.out.println("Worker ID: " + worker.getWorkerID());
            System.out.println("Worker First Name: " + worker.getWorkerFName());
        } else {
            System.out.println("No workers found in the database.");
        }
        
        worker workerB = new worker();
        workerB.setWorkerFName("Bob");
        
        System.out.println("Worker B is: " + workerB.getWorkerFName());
        
    }
}
