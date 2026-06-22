package com.SBA.BillingSystem.dto;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

import com.SBA.BillingSystem.enums.WorkOrderStatus;

class WorkOrderSummaryDTOTest {

    @Test
    void constructorStoresSummaryInformation() {
        LocalDateTime start = LocalDateTime.of(2026, 6, 22, 9, 0);
        LocalDateTime end = LocalDateTime.of(2026, 6, 22, 11, 30);

        WorkOrderSummaryDTO summary = new WorkOrderSummaryDTO(
                12,
                "Acme Services",
                "Pat Lee",
                "100 Main Street",
                WorkOrderStatus.COMPLETE,
                start,
                end,
                "Job completed",
                149.99,
                3);

        assertAll(
                () -> assertEquals(12, summary.getworkOrderID()),
                () -> assertEquals("Acme Services", summary.getCompanyName()),
                () -> assertEquals("Pat Lee", summary.getWorkerName()),
                () -> assertEquals("100 Main Street", summary.getWorkAddress()),
                () -> assertEquals(WorkOrderStatus.COMPLETE, summary.getStatus()),
                () -> assertEquals(start, summary.getStartDateTime()),
                () -> assertEquals(end, summary.getEndDateTime()),
                () -> assertEquals("Job completed", summary.getComment()),
                () -> assertEquals(149.99, summary.getTotalPrice()),
                () -> assertEquals(3, summary.getFileNo()));
    }

    @Test
    void settersUpdateSummaryInformation() {
        WorkOrderSummaryDTO summary = new WorkOrderSummaryDTO();
        LocalDateTime start = LocalDateTime.of(2026, 6, 22, 8, 0);
        LocalDateTime end = LocalDateTime.of(2026, 6, 22, 10, 0);

        summary.setworkOrderID(5);
        summary.setCompanyName("Updated Company");
        summary.setWorkerName("Sam Hill");
        summary.setWorkAddress("200 Oak Avenue");
        summary.setStatus(WorkOrderStatus.IN_REVIEW);
        summary.setStartDateTime(start);
        summary.setEndDateTime(end);
        summary.setComment("Ready for review");
        summary.setTotalPrice(85.50);
        summary.setFileNo(2);

        assertAll(
                () -> assertEquals(5, summary.getworkOrderID()),
                () -> assertEquals("Updated Company", summary.getCompanyName()),
                () -> assertEquals("Sam Hill", summary.getWorkerName()),
                () -> assertEquals("200 Oak Avenue", summary.getWorkAddress()),
                () -> assertEquals(WorkOrderStatus.IN_REVIEW, summary.getStatus()),
                () -> assertEquals(start, summary.getStartDateTime()),
                () -> assertEquals(end, summary.getEndDateTime()),
                () -> assertEquals("Ready for review", summary.getComment()),
                () -> assertEquals(85.50, summary.getTotalPrice()),
                () -> assertEquals(2, summary.getFileNo()));
    }
}
