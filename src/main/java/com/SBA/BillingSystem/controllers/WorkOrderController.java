package com.SBA.BillingSystem.controllers;

import org.springframework.web.bind.annotation.*;
import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.services.WorkOrderService;
import java.util.List;

@RestController
@RequestMapping("/workorders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.findAll();
    }

    @GetMapping("/{id}")
    public WorkOrder getWorkOrderById(@PathVariable Integer id) {
        return workOrderService.findById(id).orElse(null);
    }

    @GetMapping("/company/{companyID}")
    public List<WorkOrder> getWorkOrderByCompany(@PathVariable Integer companyID) {
        return workOrderService.findByCompanyID(companyID);
    }

    @PostMapping
    public WorkOrder addWorkOrder(@RequestBody WorkOrder workOrder) {
        return workOrderService.save(workOrder);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkOrder(@PathVariable Integer id) {
    	workOrderService.deleteById(id);
    }
    
    @GetMapping("/count")
    public long getWorkOrderCount() {
        return workOrderService.count();
    }
}
