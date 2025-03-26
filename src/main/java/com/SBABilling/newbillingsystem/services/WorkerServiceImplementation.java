package com.SBABilling.newbillingsystem.services;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.repositories.*;

@Service
public class WorkerServiceImplementation implements WorkerService {

    @Autowired
    private WorkerRepository workerRepository;

    @Override
    public Worker saveWorker(Worker worker) {
        return workerRepository.save(worker);
    }

    @Override
    public java.util.List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    @Override // This method attempts to find a worker by username and checks if the password matches.
    public Optional<Worker> login(String username, String password) {
        return workerRepository.findByUsername(username).filter(worker -> worker.getPassword().equals(password));
    }




}
