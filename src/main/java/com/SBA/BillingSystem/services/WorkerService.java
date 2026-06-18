package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;

import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.repositories.WorkerRepository;

@Service
public class WorkerService extends GenericService<Worker, Integer> {

    private final WorkerRepository WorkerRepository;

    public WorkerService(WorkerRepository WorkerRepository) {
        super(WorkerRepository);
        this.WorkerRepository = WorkerRepository;
    }

    public Worker findByUsername(String username) {
        return WorkerRepository.findByWorkerUser(username);
    }
}
