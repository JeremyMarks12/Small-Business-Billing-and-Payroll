package com.SBA.BillingSystem.controllers;

import org.springframework.web.bind.annotation.*;
import com.SBA.BillingSystem.Worker;
import com.SBA.BillingSystem.services.workerService;

import java.util.List;

@RestController
@RequestMapping("/workers")
public class workerController {

    private final workerService workerService;

    public workerController(workerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerService.findAll();
    }

    @GetMapping("/{id}")
    public Worker getWorkerById(@PathVariable Integer id) {
        return workerService.findById(id).orElse(null);
    }

    @GetMapping("/username/{username}")
    public Worker getWorkerByUsername(@PathVariable String username) {
        return workerService.findByUsername(username);
    }

    @PostMapping
    public Worker addWorker(@RequestBody Worker worker) {
        return workerService.save(worker);
    }

    @DeleteMapping("/{id}")
    public void deleteWorker(@PathVariable Integer id) {
        workerService.deleteById(id);
    }
}
