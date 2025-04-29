package com.SBABilling.newbillingsystem.controllers;

import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.core.io.*;
import org.springframework.format.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.services.*;

@RestController
@RequestMapping("/workorders")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkOrderController {

    @Autowired
    private WorkOrderService workOrderService;

    @Autowired
    private WorkerService workerService;

    private final String uploadDirectory = "C:/uploads";

    @PostMapping("/add")
    public ResponseEntity<String> uploadWorkOrder(
            @RequestParam("inspectorUsername") String inspectorUsername,
            @RequestParam("assignedDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate assignedDate,
            @RequestParam("file") MultipartFile file) {

        try {
            // 1. Lookup the inspector in the DB
            Optional<Worker> inspectorOpt = workerService.getAllWorkers().stream()
                    .filter(w -> w.getUsername().equals(inspectorUsername))
                    .findFirst();

            if (inspectorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inspector not found");
            }

            Worker inspector = inspectorOpt.get();

            // 2. Save file to filesystem
            String filePath = uploadDirectory + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.createDirectories(Paths.get(uploadDirectory));
            file.transferTo(new File(filePath));

            // 3. Create and save the work order
            WorkOrder workOrder = new WorkOrder(inspector, assignedDate, filePath);
            workOrderService.saveWorkOrder(workOrder);

            return ResponseEntity.ok("Work order uploaded successfully");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }

    @GetMapping("/all")
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.getAllWorkOrders();
    }

    @GetMapping("/inspector")
    public List<WorkOrder> getWorkOrdersByInspector(@RequestParam String inspectorUsername) {
        return workOrderService.getWorkOrdersByInspectorName(inspectorUsername);
    }


    @GetMapping("/search")
    public List<WorkOrder> getWorkOrdersByInspectorAndDate(
            @RequestParam String inspectorUsername,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate assignedDate) {

        return workOrderService.getAllWorkOrders().stream()
                .filter(order ->
                        order.getInspector().getUsername().equals(inspectorUsername) &&
                        order.getAssignedDate().equals(assignedDate)
                )
                .toList();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadWorkOrderFile(@PathVariable int id) {
        Optional<WorkOrder> optionalOrder = workOrderService.getAllWorkOrders().stream()
                .filter(w -> w.getId() == id)
                .findFirst();

        if (optionalOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WorkOrder workOrder = optionalOrder.get();
        Path filePath = Paths.get(workOrder.getPdfPath());

        try {
            byte[] fileBytes = Files.readAllBytes(filePath);
            String fileName = filePath.getFileName().toString();
            ByteArrayResource resource = new ByteArrayResource(fileBytes);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}


