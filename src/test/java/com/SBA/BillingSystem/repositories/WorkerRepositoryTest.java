package com.SBA.BillingSystem.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.SBA.BillingSystem.entities.Worker;

@DataJpaTest
class WorkerRepositoryTest {

    @Autowired
    private WorkerRepository workerRepository;

    @Test
    void findByWorkerUserIgnoreCaseFindsUsernameRegardlessOfCase() {
        Worker worker = new Worker("Pat", "Lee", "PatLee", "encoded-password", false);
        workerRepository.saveAndFlush(worker);

        assertThat(workerRepository.findByWorkerUserIgnoreCase("patlee"))
                .containsSame(worker);
        assertThat(workerRepository.findByWorkerUserIgnoreCase("PATLEE"))
                .containsSame(worker);
    }

    @Test
    void findByWorkerUserIgnoreCaseReturnsEmptyForUnknownUsername() {
        assertThat(workerRepository.findByWorkerUserIgnoreCase("missing")).isEmpty();
    }

    @Test
    void saveAndDeleteWorker() {
        Worker saved = workerRepository.saveAndFlush(
                new Worker("Sam", "Taylor", "staylor", "encoded-password", true));

        assertThat(saved.getWorkerID()).isPositive();

        workerRepository.deleteById(saved.getWorkerID());
        workerRepository.flush();

        assertThat(workerRepository.findById(saved.getWorkerID())).isEmpty();
    }
}
