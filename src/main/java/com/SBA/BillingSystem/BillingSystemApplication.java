package com.SBA.BillingSystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.SBA.BillingSystem.services.workerService;
import com.SBA.BillingSystem.services.workOrderService;
import java.util.List;

@SpringBootApplication
public class BillingSystemApplication implements CommandLineRunner {

    @Autowired
    private workerService workerService; // Worker service for fetching workers

    @Autowired
    private workOrderService workOrderService; // WorkOrder service for fetching work orders

    public static void main(String[] args) {
        SpringApplication.run(BillingSystemApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
    	
    	// Initiate Testing Grounds!
    	
        // Print all Workers
        System.out.println("\n====== List of Workers ======");
        List<Worker> workers = workerService.findAll();
        if (workers.isEmpty()) {
            System.out.println("No workers found in the database.");
        } else {
            for (Worker worker : workers) {
                System.out.println("Worker ID: " + worker.getWorkerID());
                System.out.println("First Name: " + worker.getworkerFName());
                System.out.println("Last Name: " + worker.getworkerLName());
                System.out.println("Username: " + worker.getWorkerUser());
                System.out.println("Admin Status: " + worker.isAdmin());
                System.out.println("----------------------------------");
            }
        }

        // Print all Work Orders
        System.out.println("\n====== List of Work Orders ======");
        List<workOrder> workOrders = workOrderService.findAll();
        if (workOrders.isEmpty()) {
            System.out.println("No work orders found in the database.");
        } else {
            for (workOrder workOrder : workOrders) {
                System.out.println("Work Order ID: " + workOrder.getWorkOrderID());
                System.out.println("Worker ID: " + workOrder.getWOWorkerID());
                System.out.println("Company ID: " + workOrder.getWOCompanyID());
                System.out.println("PDF File: " + workOrder.getWorkOrderPDF());
                System.out.println("----------------------------------");
            }
        }
    }
}


