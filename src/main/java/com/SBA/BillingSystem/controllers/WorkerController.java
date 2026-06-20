package com.SBA.BillingSystem.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.SBA.BillingSystem.dto.PasswordResetRequest;
import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.services.WorkerService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/workers")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService WorkerService) {
        this.workerService = WorkerService;
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
    public ResponseEntity<Worker> getWorkerByUsername(@PathVariable String username) {
    	
        Optional<Worker> worker = workerService.findByUsername(username);

        if (worker.isPresent()) {
            return ResponseEntity.ok(worker.get());
        }
        
        return ResponseEntity.notFound().build();
     }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Worker addWorker(@RequestBody Worker worker) {
        return workerService.createWorker(worker);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteWorker(@PathVariable Integer id) {
    	workerService.deleteById(id);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> resetPassword(@PathVariable Integer id, @RequestBody PasswordResetRequest request){
    	workerService.resetPassword(id,  request.getNewPassword());
    	return ResponseEntity.noContent().build();
    }
}
