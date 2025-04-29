package com.SBABilling.newbillingsystem.services;

import java.time.*;
import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.repositories.*;

@Service
public class WorkOrderServiceImplementation implements WorkOrderService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Override
    public WorkOrder saveWorkOrder(WorkOrder workOrder) {
        return workOrderRepository.save(workOrder);
    }

    @Override
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }

    @Override
    public List<WorkOrder> getWorkOrdersByInspectorName(String username) {
        return workOrderRepository.findByInspector_Username(username);
    }

    @Override
    public List<WorkOrder> getWorkOrdersByInspectorNameAndDate(String username, LocalDate assignedDate) {
        return workOrderRepository.findByInspector_UsernameAndAssignedDate(username, assignedDate);
    }
}
