package com.SBA.BillingSystem.controllers;

import com.SBA.BillingSystem.Worker;
import com.SBA.BillingSystem.dto.LoginRequest;
import com.SBA.BillingSystem.dto.LoginResponse;
import com.SBA.BillingSystem.services.WorkerService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final WorkerService workerService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(WorkerService workerService, PasswordEncoder passwordEncoder) {
        this.workerService = workerService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.getUsername() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }

        Worker w = workerService.findByUsername(req.getUsername());
        if (w == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }

        // IMPORTANT: this expects workerPW is stored as BCrypt hash in DB
        if (!passwordEncoder.matches(req.getPassword(), w.getworkerPW())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }

        LoginResponse res = new LoginResponse(
                w.getWorkerID(),
                w.getWorkerUser(),
                w.getworkerFName(),
                w.getworkerLName(),
                w.isAdmin()
        );

        return ResponseEntity.ok(res);
    }
}