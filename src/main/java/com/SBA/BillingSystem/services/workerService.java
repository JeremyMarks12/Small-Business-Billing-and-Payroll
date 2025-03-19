package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.repositories.workerRepository;
import com.SBA.BillingSystem.Worker;

@Service
public class workerService extends GenericService<Worker, Integer> {

    private final workerRepository workerRepository;

    public workerService(workerRepository workerRepository) {
        super(workerRepository);
        this.workerRepository = workerRepository;
    }

    public Worker findByUsername(String username) {
        return workerRepository.findByWorkerUser(username);
    }
}
