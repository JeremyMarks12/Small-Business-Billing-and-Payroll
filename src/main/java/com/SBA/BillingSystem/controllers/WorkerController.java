package com.SBA.BillingSystem.controllers;

import org.springframework.web.bind.annotation.*;

import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.services.WorkerService;

import java.util.List;

@RestController
@RequestMapping("/workers")
public class WorkerController {

    private final WorkerService WorkerService;

    public WorkerController(WorkerService WorkerService) {
        this.WorkerService = WorkerService;
    }

    @GetMapping
    public List<Worker> getAllWorkers() {
        return WorkerService.findAll();
    }

    @GetMapping("/{id}")
    public Worker getWorkerById(@PathVariable Integer id) {
        return WorkerService.findById(id).orElse(null);
    }

    @GetMapping("/username/{username}")
    public Worker getWorkerByUsername(@PathVariable String username) {
        return WorkerService.findByUsername(username);
    }

    @PostMapping
    public Worker addWorker(@RequestBody Worker worker) {
        return WorkerService.save(worker);
    }

    @DeleteMapping("/{id}")
    public void deleteWorker(@PathVariable Integer id) {
    	WorkerService.deleteById(id);
    }
}
