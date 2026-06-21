package com.SBA.BillingSystem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SBA.BillingSystem.entities.Worker;

public interface WorkerRepository extends JpaRepository<Worker, Integer> {
    Optional<Worker> findByWorkerUserIgnoreCase(String workerUser);
}