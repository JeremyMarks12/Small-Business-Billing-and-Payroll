package com.SBABilling.newbillingsystem.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SBABilling.newbillingsystem.models.WOItems;
import com.SBABilling.newbillingsystem.services.WOItemsService;

@RestController
@RequestMapping("/worker")
@CrossOrigin(origins = "http://localhost:3000")
public class WOItemsController {

    @Autowired
    private WOItemsService woItemsService;

    @PostMapping("/postbilling")
    public ResponseEntity<WOItems> add(@RequestBody WOItems billingForm) {
        WOItems savedBillingInfo = woItemsService.saveBillingInfo(billingForm);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBillingInfo);
    }
    
    @GetMapping("/getwoitems")
    public List<WOItems> getAllWOItems() {
        return woItemsService.getAllWOItems();
    }
    
    @GetMapping("/getwoitems/inspector/{name}")
    public List<WOItems> getWOItemsByInspectorName(@PathVariable String name) {
        return woItemsService.getWOItemsByInspectorName(name);
    }
    
    @GetMapping("/getwoitems/daterange")
    public List<WOItems> getWOItemsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return woItemsService.getWOItemsByDateRange(startDate, endDate);
    }
    
    @GetMapping("/getwoitems/inspector/daterange")
    public List<WOItems> getWOItemsByInspectorNameAndDateRange(
            @RequestParam String name,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return woItemsService.getWOItemsByInspectorNameAndDateRange(name, startDate, endDate);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteWOItem(@PathVariable int id) {
        try {
            woItemsService.deleteById(id);
            return ResponseEntity.ok("Work Order deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting Work Order: " + e.getMessage());
        }
    }
    
    // Note: The actual companies endpoint would typically be in a CompanyController
    // This is a reference endpoint in the WOItemsController for frontend convenience
    @GetMapping("/getcompanies")
    public ResponseEntity<String> getAllCompanies() {
        return ResponseEntity.status(HttpStatus.OK)
            .body("Please use /companies/all endpoint from CompanyController instead");
    }
}