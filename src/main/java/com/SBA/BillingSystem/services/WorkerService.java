package com.SBA.BillingSystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.repositories.WorkerRepository;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;


    public WorkerService(WorkerRepository workerRepository, PasswordEncoder passwordEncoder) {
        this.workerRepository = workerRepository;
		this.passwordEncoder = passwordEncoder;
    }
    
    public Worker createWorker(Worker worker) {
    	String password = worker.getWorkerPW();
    	
    	if(password == null || password.isBlank()) {
    		throw new IllegalArgumentException("Password is required");
    	}
    	
    	if (password.length() < 8) {
    	    throw new IllegalArgumentException(
    	            "Password must contain at least 8 characters");
    	}
    	
    	worker.setWorkerPW(passwordEncoder.encode(password));
    	
    	return workerRepository.save(worker);
    }

    public Optional<Worker> findByUsername(String username) {
        return workerRepository.findByWorkerUserIgnoreCase(username);
    }
    
    public List<Worker> findAll() {
        return workerRepository.findAll();
    }

    public Optional<Worker> findById(Integer id) {
        return workerRepository.findById(id);
    }

    public void deleteById(Integer id) {
        workerRepository.deleteById(id);
    }
    
    public void resetPassword(Integer workerID, String newPassword) {
    	if (newPassword == null || newPassword.isBlank()) {
    		throw new IllegalArgumentException("Password is required");
    	}
    	
    	if (newPassword.length() < 8) {
    	    throw new IllegalArgumentException(
    	            "Password must contain at least 8 characters");
    	}
    	
    	Optional<Worker> result = workerRepository.findById(workerID);
    	
    	if(result.isEmpty()) {
    		throw new IllegalArgumentException("Worker not found");
    	}
    	
    	Worker worker = result.get();
    	worker.setWorkerPW(passwordEncoder.encode(newPassword));
    	workerRepository.save(worker);
    }
    
}
