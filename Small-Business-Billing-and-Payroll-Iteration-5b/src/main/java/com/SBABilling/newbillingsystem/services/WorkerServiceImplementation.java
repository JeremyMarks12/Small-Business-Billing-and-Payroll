package com.SBABilling.newbillingsystem.services;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SBABilling.newbillingsystem.models.Worker;
import com.SBABilling.newbillingsystem.repositories.WorkerRepository;

@Service
public class WorkerServiceImplementation implements WorkerService {
    
    @Autowired
    private WorkerRepository workerRepository;
    
    @Override
    public Worker saveWorker(Worker worker) {
        return workerRepository.save(worker);
    }
    
    @Override
    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }
    
    @Override
    public Optional<Worker> login(String username, String password) {
        Optional<Worker> worker = workerRepository.findByUsername(username);
        
        if (worker.isPresent() && worker.get().getPassword().equals(password)) {
            return worker;
        }
        
        return Optional.empty();
    }
    
    @Override
    public void deleteWorker(int workerId) {
        workerRepository.deleteById(workerId);
    }
    
    @Override
    public Worker updateWorker(int id, Worker worker) {
        // If a worker with this ID exists, find it
        Optional<Worker> existingWorker = workerRepository.findById(id);
        
        if (existingWorker.isPresent()) {
            Worker workerToUpdate = existingWorker.get();      
            workerToUpdate.setFirstName(worker.getFirstName());
            workerToUpdate.setLastName(worker.getLastName());
            workerToUpdate.setUsername(worker.getUsername());
            // Only update password if provided
            if (worker.getPassword() != null && !worker.getPassword().isEmpty()) {
                workerToUpdate.setPassword(worker.getPassword());
            }
            
            // Save and return updated worker
            return workerRepository.save(workerToUpdate);
        } else {
            throw new RuntimeException("Worker not found with ID: " + worker.getWorkerID());
        }
    }
}