package com.SBA.BillingSystem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import com.SBA.BillingSystem.*;



@Repository
public interface DBRepository extends JpaRepository <Worker, Integer> {
    //Worker findByUserName(String userName); // Allows us to find a worker by their username
    List<Worker> findAll();
	Optional<Worker> findByIsAdmin(Boolean isAdmin);	// Find by isAdmin. MUST MATCH THE COLUMN NAME IN THE DATABASE
	Optional<Worker> findByWorkerUser(String workerUser);	// Find by username or uniqueID. MUST MATCH THE COLUMN NAME IN THE DATABASE
	Optional<Worker> findByWorkerID(Integer workerID);		// Find by workerID). MUST MATCH THE COLUMN NAME IN THE DATABASE
    
	
	List<workOrder> findAllworkOrders();
	Optional<workOrder> findByworkOrderID(Integer workOrderID);
	Optional<workOrder> findByworkOrderName(String workOrderName);
	Optional<workOrder> findByworkOrderWorkerID(Integer workOrderWorkerID);
	workOrder save(workOrder nworkOrder);
	

}
