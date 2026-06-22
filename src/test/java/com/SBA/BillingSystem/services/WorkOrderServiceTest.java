package com.SBA.BillingSystem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.SBA.BillingSystem.entities.Company;
import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.entities.WorkOrderItem;
import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.enums.WorkOrderStatus;
import com.SBA.BillingSystem.repositories.WorkOrderRepository;

@ExtendWith(MockitoExtension.class)
public class WorkOrderServiceTest {

    @Mock
    private WorkOrderRepository workOrderRepository;

    @InjectMocks
    private WorkOrderService workOrderService;

    @Test
    void createWorkOrderResetsIdAndStatusBeforeSaving() {
        WorkOrder workOrder = new WorkOrder();
        workOrder.setWorkOrderID(25);
        workOrder.setStatus(WorkOrderStatus.COMPLETE);
        when(workOrderRepository.save(workOrder)).thenReturn(workOrder);

        WorkOrder result = workOrderService.createWorkOrder(workOrder);

        assertSame(workOrder, result);
        assertEquals(0, workOrder.getWorkOrderID());
        assertEquals(WorkOrderStatus.OPEN, workOrder.getStatus());
    }

    @Test
    void findAndCountMethodsReturnRepositoryResults() {
        WorkOrder workOrder = new WorkOrder();
        List<WorkOrder> workOrders = List.of(workOrder);
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));
        when(workOrderRepository.findAll()).thenReturn(workOrders);
        when(workOrderRepository.findByCompany_CompanyID(2)).thenReturn(workOrders);
        when(workOrderRepository.count()).thenReturn(1L);

        assertEquals(Optional.of(workOrder), workOrderService.findById(1));
        assertSame(workOrders, workOrderService.findAll());
        assertSame(workOrders, workOrderService.findByCompanyID(2));
        assertEquals(1L, workOrderService.count());
    }

    @Test
    void startWorkOrderMovesOpenOrderToInProcess() {
        WorkOrder workOrder = orderWithStatus(WorkOrderStatus.OPEN);
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));
        when(workOrderRepository.save(workOrder)).thenReturn(workOrder);

        WorkOrder result = workOrderService.startWorkOrder(1);

        assertSame(workOrder, result);
        assertEquals(WorkOrderStatus.IN_PROCESS, workOrder.getStatus());
    }

    @Test
    void startWorkOrderRejectsOrderThatIsNotOpen() {
        WorkOrder workOrder = orderWithStatus(WorkOrderStatus.IN_PROCESS);
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));

        assertThrows(IllegalStateException.class, () -> workOrderService.startWorkOrder(1));
        verify(workOrderRepository, never()).save(workOrder);
    }

    @Test
    void submitForReviewMovesInProcessOrderToReview() {
        WorkOrder workOrder = orderWithStatus(WorkOrderStatus.IN_PROCESS);
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));
        when(workOrderRepository.save(workOrder)).thenReturn(workOrder);

        workOrderService.submitForReview(1);

        assertEquals(WorkOrderStatus.IN_REVIEW, workOrder.getStatus());
    }

    @Test
    void rejectWorkOrderReturnsReviewOrderToInProcess() {
        WorkOrder workOrder = orderWithStatus(WorkOrderStatus.IN_REVIEW);
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));
        when(workOrderRepository.save(workOrder)).thenReturn(workOrder);

        workOrderService.rejectWorkOrder(1);

        assertEquals(WorkOrderStatus.IN_PROCESS, workOrder.getStatus());
    }

    @Test
    void approveWorkOrderCompletesValidReviewOrder() {
        WorkOrder workOrder = validOrderForCompletion();
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));
        when(workOrderRepository.save(workOrder)).thenReturn(workOrder);

        WorkOrder result = workOrderService.approveWorkOrder(1);

        assertSame(workOrder, result);
        assertEquals(WorkOrderStatus.COMPLETE, workOrder.getStatus());
    }

    @Test
    void approveWorkOrderRejectsIncompleteOrder() {
        WorkOrder workOrder = orderWithStatus(WorkOrderStatus.IN_REVIEW);
        workOrder.setWorkOrderID(1);
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));

        assertThrows(IllegalStateException.class,
                () -> workOrderService.approveWorkOrder(1));
        verify(workOrderRepository, never()).save(workOrder);
    }

    @Test
    void workflowMethodsRejectUnknownWorkOrder() {
        when(workOrderRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> workOrderService.startWorkOrder(99));
        assertThrows(IllegalArgumentException.class,
                () -> workOrderService.deleteById(99));
    }

    @Test
    void deleteByIdDeletesFoundWorkOrder() {
        WorkOrder workOrder = new WorkOrder();
        when(workOrderRepository.findById(1)).thenReturn(Optional.of(workOrder));

        workOrderService.deleteById(1);

        verify(workOrderRepository).delete(workOrder);
    }

    private WorkOrder orderWithStatus(WorkOrderStatus status) {
        WorkOrder workOrder = new WorkOrder();
        workOrder.setStatus(status);
        return workOrder;
    }

    private WorkOrder validOrderForCompletion() {
        WorkOrder workOrder = orderWithStatus(WorkOrderStatus.IN_REVIEW);
        Company company = new Company();
        company.setCompanyID(1);

        workOrder.setWorkOrderID(1);
        workOrder.setCompany(company);
        workOrder.addWorker(new Worker());
        workOrder.setStartDateTime(LocalDateTime.now().minusHours(1));
        workOrder.setEndDateTime(LocalDateTime.now());
        workOrder.addItem(new WorkOrderItem());
        return workOrder;
    }
}
