package com.SBA.BillingSystem.controllers;

import org.springframework.web.bind.annotation.*;

import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.services.WorkOrderService;

import java.util.List;

@RestController
@RequestMapping("/workorders")
public class WorkOrderController {

    private final WorkOrderService WorkOrderService;

    public WorkOrderController(WorkOrderService WorkOrderService) {
        this.WorkOrderService = WorkOrderService;
    }

    @GetMapping
    public List<WorkOrder> getAllWorkOrders() {
        return WorkOrderService.findAll();
    }

    @GetMapping("/{id}")
    public WorkOrder getWorkOrderById(@PathVariable Integer id) {
        return WorkOrderService.findById(id).orElse(null);
    }

    @GetMapping("/company/{companyID}")
    public WorkOrder getWorkOrderByCompany(@PathVariable Integer companyID) {
        return WorkOrderService.findByCompanyID(companyID);
    }

    @PostMapping
    public WorkOrder addWorkOrder(@RequestBody WorkOrder WorkOrder) {
        return WorkOrderService.save(WorkOrder);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkOrder(@PathVariable Integer id) {
    	WorkOrderService.deleteById(id);
    }
    
    //Added for counting sake. Might delete as it is redundant since we can already get a list of work orders.
    @GetMapping("/count")
    public long getWorkOrderCount() {
        return WorkOrderService.findAll().size();
    }
}
