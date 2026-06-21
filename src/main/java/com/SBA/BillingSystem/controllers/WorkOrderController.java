package com.SBA.BillingSystem.controllers;

import org.springframework.web.bind.annotation.*;
import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.services.WorkOrderService;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/workorders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/start")
    public WorkOrder startWorkOrder(@PathVariable Integer id) {
    	return workOrderService.startWorkOrder(id);
    }

    @GetMapping
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrder> getWorkOrderById(@PathVariable Integer id) {
    	
    	Optional<WorkOrder> workOrder = workOrderService.findById(id);
    	
    	if(workOrder.isPresent()) {
    		return ResponseEntity.ok(workOrder.get());
    	}
    	
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/company/{companyID}")
    public List<WorkOrder> getWorkOrderByCompany(@PathVariable Integer companyID) {
        return workOrderService.findByCompanyID(companyID);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public WorkOrder addWorkOrder(@RequestBody WorkOrder workOrder) {
        return workOrderService.createWorkOrder(workOrder);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteWorkOrder(@PathVariable Integer id) {
    	workOrderService.deleteById(id);
    }
    
    @GetMapping("/count")
    public long getWorkOrderCount() {
        return workOrderService.count();
    }
    
    @PutMapping("/{id}/submit")
    public WorkOrder submitForReview(@PathVariable Integer id) {
    	return workOrderService.submitForReview(id);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public WorkOrder approveWorkOrder(@PathVariable Integer id) {
    	return workOrderService.approveWorkOrder(id);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public WorkOrder rejectWorkOrder(@PathVariable Integer id) {
    	return workOrderService.rejectWorkOrder(id);
    }
}
