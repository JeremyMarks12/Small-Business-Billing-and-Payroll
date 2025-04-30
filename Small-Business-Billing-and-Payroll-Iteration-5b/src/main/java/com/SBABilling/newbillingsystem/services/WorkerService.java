package com.SBABilling.newbillingsystem.services;
import java.util.*;

import com.SBABilling.newbillingsystem.models.*;

public interface WorkerService {

    public Worker saveWorker(Worker worker); // Used to save the workers information into the DB

    public List<Worker> getAllWorkers();

    public Optional<Worker> login(String username, String password);
    
    public void deleteWorker(int workerId);

	Worker updateWorker(int id, Worker worker);
}