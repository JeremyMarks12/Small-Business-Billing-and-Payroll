package com.SBA.BillingSystem.services;

import java.util.*;
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

    public Optional<Worker> findByUsername(String username) {
        return workerRepository.findByWorkerUserIgnoreCase(username);
    }
    
    public List<Worker> findAll() {
        return workerRepository.findAll();
    }

    public Optional<Worker> findById(Integer id) {
        return workerRepository.findById(id);
    }

    public Worker save(Worker worker) {
        String encodedPassword =
                passwordEncoder.encode(worker.getWorkerPW());

        worker.setWorkerPW(encodedPassword);

        return workerRepository.save(worker);
    }

    public void deleteById(Integer id) {
        workerRepository.deleteById(id);
    }
    
    
    
}
