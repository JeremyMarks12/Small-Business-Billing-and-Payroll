package com.SBABilling.newbillingsystem.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.services.*;

@RestController
@RequestMapping("/worker")
@CrossOrigin(origins = "http://localhost:3000") // allows React frontend to communicate
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    @PostMapping("/add") //This is the code that saves the data into the database.
    public String add(@RequestBody Worker worker) {
        workerService.saveWorker(worker);
        return "New Worker has been added";
    }

    @GetMapping("/getAll")
    public List<Worker> getAllWorkers() {
        return workerService.getAllWorkers();
    }

    // This recieves the username and password from the web browser, validates them and returns a response.
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        Optional<Worker> worker = workerService.login(username, password);
        if (worker.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("workerID", worker.get().getWorkerID());
            response.put("username", worker.get().getUsername());
            response.put("firstName", worker.get().getFirstName());
            response.put("lastName", worker.get().getLastName());
            response.put("password", worker.get().getPassword());
            response.put("isAdmin", worker.get().isAdmin());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid username or password"));
        }
    }

    @PutMapping("/update/{id}") // Allows the user to update their username or password if they choose to do so.
    public ResponseEntity<String> updateWorker(@PathVariable int id, @RequestBody Worker updatedWorker) {
        Optional<Worker> existing = workerService.getAllWorkers().stream()
            .filter(w -> w.getWorkerID() == id)
            .findFirst();

        if (existing.isPresent()) {
            Worker worker = existing.get();

            if (updatedWorker.getUsername() != null && !updatedWorker.getUsername().isEmpty()) {
                worker.setUsername(updatedWorker.getUsername());
            }

            if (updatedWorker.getPassword() != null && !updatedWorker.getPassword().isEmpty()) {
                worker.setPassword(updatedWorker.getPassword());
            }

            workerService.saveWorker(worker);
            return ResponseEntity.ok("Worker updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Worker not found");
        }
    }



}
