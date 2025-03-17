package com.SBA.BillingSystem.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;

import com.SBA.BillingSystem.*;
import com.SBA.BillingSystem.services.*;


@RestController
@RequestMapping("/api/auth")
public class DBController {

    @Autowired
    private  DBService DBService;

    @GetMapping("/workOrder")
    public List<workOrder> getAllworkOrders() {
    	return DBService.getAllworkOrders();
    }
        
    @GetMapping("/all")
	public List<Worker> getAllWorkers() {
		return DBService.getAll();
	}
    
    @PostMapping("/add")
    public workOrder createWorkOrder(@RequestBody workOrder workOrder) {
        return DBService.addworkOrder(workOrder);
    }
        
//    // Register a user
//    @PostMapping("/register")
//    public String registerWorker(@RequestBody Worker worker) {
//        return authService.registerWorker(worker);
//    }
//
//    // Login endpoint
//    @PostMapping("/login")
//    public String login(@RequestParam String userName, @RequestParam String password) {
//        if (authService.validateLogin(userName, password)) {
//            return "Login successful";
//        }
//        return "Incorrect username or password";
//    }

}
