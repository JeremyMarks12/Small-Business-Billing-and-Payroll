package com.SBABilling.newbillingsystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.SBABilling.newbillingsystem.models.WorkOrder;
import com.SBABilling.newbillingsystem.services.WorkOrderService;

import java.util.List;

@RestController
@RequestMapping("/WorkOrders")
public class WorkOrderController {
	
	@Autowired
    private WorkOrderService WorkOrderService;


    @GetMapping
    public List<WorkOrder> getAllWorkOrders() {
    	return WorkOrderService.getAllWorkOrders();
    }
    
    

    @PostMapping
    public WorkOrder addWorkOrder(@RequestBody WorkOrder WorkOrder) {
        return WorkOrderService.saveWorkOrder(WorkOrder);
    }

//    @DeleteMapping("/{id}")
//    public void deleteWorkOrder(@PathVariable Integer id) {
//        WorkOrderController.deleteById(id);
//    }
}