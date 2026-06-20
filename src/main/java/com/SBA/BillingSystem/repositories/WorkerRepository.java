package com.SBA.BillingSystem.repositories;

import java.util.Optional;
import com.SBA.BillingSystem.entities.Worker;

public interface WorkerRepository extends GenericRepository<Worker, Integer> {
    Optional<Worker> findByWorkerUserIgnoreCase(String workerUser);
}