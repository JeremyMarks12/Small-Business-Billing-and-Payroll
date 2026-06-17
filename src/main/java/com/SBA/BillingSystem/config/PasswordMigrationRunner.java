package com.SBA.BillingSystem.config;

import com.SBA.BillingSystem.Worker;
import com.SBA.BillingSystem.repositories.WorkerRepository; // adjust package name
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigrationRunner implements CommandLineRunner {

    private final WorkerRepository repo;
    private final PasswordEncoder encoder;

    public PasswordMigrationRunner(WorkerRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        // If you can query admins specifically, do that. Otherwise filter in Java:
        List<Worker> workers = repo.findAll();

        for (Worker w : workers) {
            String pw = w.getworkerPW(); // your getter
            if (pw == null) continue;

            boolean looksBcrypt = pw.startsWith("$2a$") || pw.startsWith("$2b$") || pw.startsWith("$2y$");
            if (!looksBcrypt) {
                w.setworkerPW(encoder.encode(pw));
                repo.save(w);
            }
        }
    }
}