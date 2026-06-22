package com.SBA.BillingSystem.entities;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

import com.SBA.BillingSystem.enums.DocumentType;

class WorkOrderDocumentTest {

    @Test
    void constructorSetsDocumentDetails() {
        WorkOrder workOrder = new WorkOrder();
        Worker worker = new Worker();
        byte[] data = { 1, 2, 3 };
        LocalDateTime uploadedAt = LocalDateTime.of(2026, 6, 22, 10, 30);

        WorkOrderDocument document = new WorkOrderDocument(
                workOrder, "receipt.pdf", DocumentType.RECEIPT, data,
                uploadedAt, worker, "application/pdf", data.length);

        assertAll(
                () -> assertSame(workOrder, document.getWorkOrder()),
                () -> assertEquals("receipt.pdf", document.getFileName()),
                () -> assertEquals(DocumentType.RECEIPT, document.getDocumentType()),
                () -> assertArrayEquals(data, document.getDocumentData()),
                () -> assertEquals(uploadedAt, document.getUploadDateTime()),
                () -> assertSame(worker, document.getUploadedByWorker()),
                () -> assertEquals("application/pdf", document.getMimeType()),
                () -> assertEquals(data.length, document.getFileSize()));
    }

    @Test
    void settersUpdateDocumentDetails() {
        WorkOrderDocument document = new WorkOrderDocument();
        WorkOrder workOrder = new WorkOrder();
        Worker worker = new Worker();
        byte[] data = { 4, 5 };
        LocalDateTime uploadedAt = LocalDateTime.of(2026, 6, 22, 11, 0);

        document.setDocumentID(20);
        document.setWorkOrder(workOrder);
        document.setFileName("work-order.txt");
        document.setDocumentType(DocumentType.WORK_ORDER);
        document.setDocumentData(data);
        document.setUploadDateTime(uploadedAt);
        document.setUploadedByWorkerID(worker);
        document.setMimeType("text/plain");
        document.setFileSize(data.length);

        assertAll(
                () -> assertEquals(20, document.getDocumentID()),
                () -> assertSame(workOrder, document.getWorkOrder()),
                () -> assertEquals("work-order.txt", document.getFileName()),
                () -> assertEquals(DocumentType.WORK_ORDER, document.getDocumentType()),
                () -> assertArrayEquals(data, document.getDocumentData()),
                () -> assertEquals(uploadedAt, document.getUploadDateTime()),
                () -> assertSame(worker, document.getUploadedByWorker()),
                () -> assertEquals("text/plain", document.getMimeType()),
                () -> assertEquals(data.length, document.getFileSize()));
    }
}
