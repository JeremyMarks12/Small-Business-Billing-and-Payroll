package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.repositories.workOrderRepository;
import com.SBA.BillingSystem.workOrder;

@Service
public class workOrderService extends GenericService<workOrder, Integer> {

    private final workOrderRepository workOrderRepository;

    public workOrderService(workOrderRepository workOrderRepository) {
        super(workOrderRepository); // Explicitly calling the parent constructor
        this.workOrderRepository = workOrderRepository;
    }

    public workOrder findByCompanyID(Integer companyID) {
        return workOrderRepository.findByCompanyID(companyID);
    }
}
