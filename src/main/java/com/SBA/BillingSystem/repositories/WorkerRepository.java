package com.SBA.BillingSystem.repositories;

import org.springframework.stereotype.Repository;

import com.SBA.BillingSystem.Worker;

@Repository
public interface WorkerRepository extends GenericRepository<Worker, Integer> {
    Worker findByWorkerUser(String workerUser);
}