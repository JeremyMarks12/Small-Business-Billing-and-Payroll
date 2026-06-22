package com.SBA.BillingSystem.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.entities.WorkOrderDocument;
import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.enums.DocumentType;

@DataJpaTest
class WODocumentRepositoryTest {

    @Autowired
    private WODocumentRepository documentRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Test
    void saveAndFindByIdPersistsDocumentMetadataAndRelationships() {
        WorkOrder workOrder = workOrderRepository.saveAndFlush(new WorkOrder());
        Worker worker = workerRepository.saveAndFlush(
                new Worker("Pat", "Lee", "plee", "encoded-password", false));
        byte[] data = { 1, 2, 3 };
        LocalDateTime uploadedAt = LocalDateTime.of(2026, 6, 22, 10, 30);
        WorkOrderDocument document = new WorkOrderDocument(
                workOrder, "receipt.pdf", DocumentType.RECEIPT, data,
                uploadedAt, worker, "application/pdf", data.length);

        WorkOrderDocument saved = documentRepository.saveAndFlush(document);

        assertThat(saved.getDocumentID()).isPositive();
        assertThat(documentRepository.findById(saved.getDocumentID()))
                .hasValueSatisfying(found -> {
                    assertThat(found.getFileName()).isEqualTo("receipt.pdf");
                    assertThat(found.getDocumentType()).isEqualTo(DocumentType.RECEIPT);
                    assertThat(found.getDocumentData()).containsExactly(data);
                    assertThat(found.getMimeType()).isEqualTo("application/pdf");
                    assertThat(found.getFileSize()).isEqualTo(3);
                    assertThat(found.getWorkOrder().getWorkOrderID())
                            .isEqualTo(workOrder.getWorkOrderID());
                    assertThat(found.getUploadedByWorker().getWorkerID())
                            .isEqualTo(worker.getWorkerID());
                });
    }

    @Test
    void deleteByIdRemovesDocument() {
        WorkOrder workOrder = workOrderRepository.saveAndFlush(new WorkOrder());
        WorkOrderDocument saved = documentRepository.saveAndFlush(
                new WorkOrderDocument(
                        workOrder, "note.txt", DocumentType.OTHER, new byte[] { 1 },
                        LocalDateTime.now(), null, "text/plain", 1));

        documentRepository.deleteById(saved.getDocumentID());
        documentRepository.flush();

        assertThat(documentRepository.findById(saved.getDocumentID())).isEmpty();
    }
}
