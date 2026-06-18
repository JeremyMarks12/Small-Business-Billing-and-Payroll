package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;

import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.repositories.WorkOrderRepository;

@Service
public class WorkOrderService extends GenericService<WorkOrder, Integer> {

    private final WorkOrderRepository workOrderRepository;

    public WorkOrderService(WorkOrderRepository workOrderRepository) {
        super(workOrderRepository); // Explicitly calling the parent constructor
        this.workOrderRepository = workOrderRepository;
    }

    public WorkOrder findByCompanyID(Integer companyID) {
        return workOrderRepository.findByCompanyID(companyID);
    }
}
