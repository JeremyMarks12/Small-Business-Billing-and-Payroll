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

    // This receives the username and password from the web browser, validates them and returns a response.
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        Optional<Worker> worker = workerService.login(username, password);
        if (worker.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("username", worker.get().getUsername());
            response.put("firstName", worker.get().getFirstName());
            response.put("lastName", worker.get().getLastName());
            response.put("isAdmin", worker.get().isAdmin());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid username or password"));
        }
    }
    
    @DeleteMapping("deleteWorker/{id}")
    public ResponseEntity<?> deleteWorker(@PathVariable int id) {
        try {
            workerService.deleteWorker(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Worker deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Failed to delete worker: " + e.getMessage()));
        }
    }
    
    @PutMapping("/updateWorker/{id}")
    public String updateWorker(@PathVariable int id, @RequestBody Worker worker) {
            Worker updated = workerService.updateWorker(id, worker);
            return updated != null ? "Worker updated" : "Worker not found";
    }
}