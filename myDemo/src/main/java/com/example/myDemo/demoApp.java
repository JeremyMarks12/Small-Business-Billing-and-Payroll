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

        
    }
}
