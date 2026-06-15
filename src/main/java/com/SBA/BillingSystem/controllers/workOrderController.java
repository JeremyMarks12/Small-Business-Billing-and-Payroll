package com.SBA.BillingSystem.controllers;

import org.springframework.web.bind.annotation.*;
import com.SBA.BillingSystem.workOrder;
import com.SBA.BillingSystem.services.workOrderService;

import java.util.List;

@RestController
@RequestMapping("/workorders")
public class workOrderController {

    private final workOrderService workOrderService;

    public workOrderController(workOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping
    public List<workOrder> getAllWorkOrders() {
        return workOrderService.findAll();
    }

    @GetMapping("/{id}")
    public workOrder getWorkOrderById(@PathVariable Integer id) {
        return workOrderService.findById(id).orElse(null);
    }

    @GetMapping("/company/{companyID}")
    public workOrder getWorkOrderByCompany(@PathVariable Integer companyID) {
        return workOrderService.findByCompanyID(companyID);
    }

    @PostMapping
    public workOrder addWorkOrder(@RequestBody workOrder workOrder) {
        return workOrderService.save(workOrder);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkOrder(@PathVariable Integer id) {
        workOrderService.deleteById(id);
    }
    
    //Added for counting sake. Might delete as it is redundant since we can already get a list of work orders.
    @GetMapping("/count")
    public long getWorkOrderCount() {
        return workOrderService.findAll().size();
    }
}
