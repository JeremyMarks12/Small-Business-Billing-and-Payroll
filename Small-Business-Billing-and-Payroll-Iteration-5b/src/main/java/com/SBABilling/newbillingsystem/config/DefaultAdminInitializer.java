package com.SBABilling.newbillingsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.SBABilling.newbillingsystem.models.Worker;
import com.SBABilling.newbillingsystem.repositories.WorkerRepository;

@Component
public class DefaultAdminInitializer implements ApplicationRunner {

    @Autowired
    private WorkerRepository workerRepository;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (workerRepository.count() == 0) {
            Worker defaultAdmin = new Worker();
            defaultAdmin.setUsername("admin");
            defaultAdmin.setPassword("admin123"); 
            defaultAdmin.setFirstName("System");
            defaultAdmin.setLastName("Administrator");
            defaultAdmin.setAdmin(true);
            
            workerRepository.save(defaultAdmin);
            
            System.out.println("Default admin user created successfully.");
        } else {
            System.out.println("Workers already exist in the database. Skipping default admin creation.");
        }
    }
}
