package com.SBA.BillingSystem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.repositories.WorkerRepository;

@ExtendWith(MockitoExtension.class)
class WorkerServiceTest {

    @Mock
    private WorkerRepository workerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private WorkerService workerService;

    @Test
    void createWorkerEncodesPasswordBeforeSaving() {
        Worker worker = new Worker("Pat", "Lee", "plee", "password123", false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(workerRepository.save(worker)).thenReturn(worker);

        Worker result = workerService.createWorker(worker);

        assertSame(worker, result);
        assertEquals("encoded-password", worker.getWorkerPW());
        verify(passwordEncoder).encode("password123");
        verify(workerRepository).save(worker);
    }

    @Test
    void createWorkerRejectsMissingOrShortPassword() {
        Worker missingPassword = new Worker("Pat", "Lee", "plee", " ", false);
        Worker shortPassword = new Worker("Sam", "Hill", "shill", "short", false);

        assertThrows(IllegalArgumentException.class,
                () -> workerService.createWorker(missingPassword));
        assertThrows(IllegalArgumentException.class,
                () -> workerService.createWorker(shortPassword));

        verify(workerRepository, never()).save(missingPassword);
        verify(workerRepository, never()).save(shortPassword);
    }

    @Test
    void findMethodsReturnRepositoryResults() {
        Worker worker = new Worker();
        List<Worker> workers = List.of(worker);
        when(workerRepository.findByWorkerUserIgnoreCase("PAT")).thenReturn(Optional.of(worker));
        when(workerRepository.findById(1)).thenReturn(Optional.of(worker));
        when(workerRepository.findAll()).thenReturn(workers);

        assertEquals(Optional.of(worker), workerService.findByUsername("PAT"));
        assertEquals(Optional.of(worker), workerService.findById(1));
        assertSame(workers, workerService.findAll());
    }

    @Test
    void deleteByIdRemovesWorkerFromAssignedWorkOrders() {
        Worker worker = new Worker();
        WorkOrder first = new WorkOrder();
        WorkOrder second = new WorkOrder();
        first.addWorker(worker);
        second.addWorker(worker);
        when(workerRepository.findById(1)).thenReturn(Optional.of(worker));

        workerService.deleteById(1);

        assertFalse(first.getWorkers().contains(worker));
        assertFalse(second.getWorkers().contains(worker));
        verify(workerRepository).deleteById(1);
    }

    @Test
    void deleteByIdRejectsUnknownWorker() {
        when(workerRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> workerService.deleteById(99));
        verify(workerRepository, never()).deleteById(99);
    }

    @Test
    void resetPasswordEncodesAndSavesNewPassword() {
        Worker worker = new Worker("Pat", "Lee", "plee", "old-password", false);
        when(workerRepository.findById(1)).thenReturn(Optional.of(worker));
        when(passwordEncoder.encode("new-password")).thenReturn("encoded-new-password");

        workerService.resetPassword(1, "new-password");

        assertEquals("encoded-new-password", worker.getWorkerPW());
        verify(workerRepository).save(worker);
    }

    @Test
    void resetPasswordRejectsInvalidPasswordAndUnknownWorker() {
        assertThrows(IllegalArgumentException.class,
                () -> workerService.resetPassword(1, "short"));

        when(workerRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class,
                () -> workerService.resetPassword(99, "valid-password"));
    }
}
