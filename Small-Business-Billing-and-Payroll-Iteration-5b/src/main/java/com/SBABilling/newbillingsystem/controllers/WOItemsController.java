package com.SBABilling.newbillingsystem.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.services.*;


@RestController
@RequestMapping("/worker")
@CrossOrigin(origins = "http://localhost:3000")
public class WOItemsController {

    @Autowired
    private WOItemsServiceImplementation woItemsService;

    @Autowired
    private WorkOrderServiceImplementation workOrderService;

    @Autowired
    private CompanyServiceImplementation companyService;

    @PostMapping("/postbilling")
    public ResponseEntity<WOItems> add(@RequestBody WOItems billingForm) {
        WOItems savedBillingInfo = woItemsService.saveBillingInfo(billingForm);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedBillingInfo);
    }

    @GetMapping("/getworkorders")
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.getAllWorkOrders();
    }

    @GetMapping("/getwoitems")
    public List<WOItems> getAllWOItems() {
        return woItemsService.getAllWOItems();
    }

    @GetMapping("/getcompanies")
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteWOItem(@PathVariable int id) {
        try {
            woItemsService.deleteById(id);
            return ResponseEntity.ok("WOItem deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting WOItem");
        }
    }

}
