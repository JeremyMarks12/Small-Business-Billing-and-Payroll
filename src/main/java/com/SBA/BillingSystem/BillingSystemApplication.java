package com.SBA.BillingSystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.SBA.BillingSystem.services.DBService;



@SpringBootApplication
public class BillingSystemApplication implements CommandLineRunner {

    @Autowired
    private DBService DBService;  // Updated to match class name

    public static void main(String[] args) {
        SpringApplication.run(BillingSystemApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

        // Fetch all Workers from the database
        List<Worker> Workers = DBService.getAll();  // Call service method to fetch all Workers
        
        System.out.println("Find admin: ");
        
		for (Worker Worker1 : Workers) {
			if(Worker1.isAdmin() == true) {
				System.out.println("Worker ID: " + Worker1.getWorkerID());
				System.out.println("Worker First Name: " + Worker1.getworkerFName());
				System.out.println("Worker Last Name: " + Worker1.getworkerLName());
				System.out.println("Worker Username: " + Worker1.getWorkerUser());
				System.out.println("Worker Admin: " + Worker1.isAdmin());
				break;
			}
			else {
				System.out.println("No admin found in the database.");
			}
		}
		
		// Find a Worker by their unique ID
//		System.out.println("Finding Worker by unique ID: ");
//		for (Worker Worker1 : Workers) {
//			Worker Worker = DBService.findByUsername("AS02");
//            if (Worker != null) {
//                System.out.println("Worker ID: " + Worker.getWorkerID());
//                System.out.println("Worker First Name: " + Worker.getworkerFName());
//                System.out.println("Worker Last Name: " + Worker.getworkerLName());
//                System.out.println("Worker Username: " + Worker.getWorkerUser());
//                System.out.println("Worker Admin: " + Worker.isAdmin());
//                System.out.println();
//                break;
//            }
//			else {
//				System.out.println("No Worker found with the unique ID AS02");
//			}
//            }
		
//		System.out.println("Creating and instering a new Worker into the database: ");
//		Worker abraham = new Worker();
//		abraham.setWorkerID(5);
//		abraham.setWorkerFName("Abraham");
//		abraham.setWorkerLName("Lincoln");
//		abraham.setWorkerUser("abrLincn");
//		abraham.setWorkerPW("password");
//		abraham.setIsAdmin(false);
//		abraham.setUnqiueIdentifier("AL01");
//		DBService.addWorker(abraham);
//		
//		System.out.println("Worker Abraham Lincoln added to the database.");
//		
//		for (Worker Worker2 : Workers) {
//			if (Worker2.getworkerFName().equals("Abraham")) {
//                System.out.println("Worker ID: " + Worker.getWorkerID());
//                System.out.println("Worker First Name: " + Worker.getworkerFName());
//                System.out.println("Worker Last Name: " + Worker.getworkerLName());
//                System.out.println("Worker Username: " + Worker.getUserName());
//                System.out.println("Worker Admin: " + Worker.isAdmin());
//				break;
//			} else {
//				System.out.println("No Worker found with the name Abraham.");
//			}
//		}
//		
//		System.out.println("Deleting Worker Abraham Lincoln from the database.");
//		DBService.deleteWorker(5);
//		System.out.println("Worker Abraham Lincoln deleted from the database.");
//		}
		

		
		
    }
 }

