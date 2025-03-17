package com.SBA.BillingSystem.services;

import java.util.List;

import org.springframework.beans.factory.annotation.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.stereotype.*;

import com.SBA.BillingSystem.*;
import com.SBA.BillingSystem.repositories.*;

@Service
public class DBService {

    @Autowired
    private DBRepository DBRepository;
    

    //private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Get Admin
	public Worker getAdmin(Boolean isAdmin) {
    	return DBRepository.findByIsAdmin(isAdmin).orElse(null);
	}
	
    // Find services
    public List<Worker> getAll() {	// creates a list of all Workers. Not ideal for large databases.
		return DBRepository.findAll();
	}

    public Worker findByUsername(String anyStringInput) {
        return DBRepository.findByWorkerUser(anyStringInput).orElse(null);
    }
	
	public Worker findByInt(int anyIntInput) {
		return DBRepository.findByWorkerID(anyIntInput).orElse(null);
	}

	// Modifying the elements in the database
    public Worker addWorker(Worker nWorker) {
        return DBRepository.save(nWorker); // Saves Worker to DB
    }
    
	public Worker updateWorker(Integer WorkerID, Worker updatedWorker) {
		return DBRepository.save(updatedWorker); // Updates Worker in DB
	}
	
	public void deleteWorker(Integer WorkerID) {
		DBRepository.deleteById(WorkerID); // Deletes Worker from DB
	}
	
	public void deleteAllWorkers() {DBRepository.deleteAll();}	// Deletes all Workers from DB. Fail safe method.
	
	// Work Order Stuff
	
	public List<workOrder> getAllworkOrders() { // creates a list of all workOrders. Not ideal for large databases.
		return DBRepository.findAllworkOrders();
	}
	
	public workOrder addworkOrder(workOrder nworkOrder) {
		return DBRepository.save(nworkOrder); // Saves workOrder to DB
	}
	
	public workOrder updateworkOrder(Integer workOrderID, workOrder updatedworkOrder) {
		return DBRepository.save(updatedworkOrder); // Updates workOrder in DB
	}
	
	public void deleteworkOrder(Integer workOrderID) {
		DBRepository.deleteById(workOrderID); // Deletes workOrder from DB
	}
	
	public void deleteAllworkOrders() {DBRepository.deleteAll();}	// Deletes all workOrders from DB. Fail safe method.
	
//    // Register new user
//    public String registerWorker(Worker Worker) {
//        Worker.setPassword(passwordEncoder.encode(Worker.getPassword()));
//        DBRepository.save(Worker);
//        return "Registered successfully";
//    }
//
//    // Validate Login
//    public boolean validateLogin(String userName, String password) {
//        Worker Worker = DBRepository.findByUserName(userName);
//        if (Worker != null) {
//            return passwordEncoder.matches(password, Worker.getPassword());
//        }
//        return false;
//    }

}
