package com.SBA.BillingSystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.repositories.WorkOrderRepository;

@Service
public class WorkOrderService{

    private final WorkOrderRepository workOrderRepository;

    public WorkOrderService(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    public List<WorkOrder> findByCompanyID(Integer companyID) {
        return workOrderRepository.findByCompany_CompanyID(companyID);
    }
    
    public Optional<WorkOrder> findById(Integer id) {
        return workOrderRepository.findById(id);
    }
    
    public List<WorkOrder> findAll() {
        return workOrderRepository.findAll();
    }

    public WorkOrder save(WorkOrder workOrder) {
        return workOrderRepository.save(workOrder);
    }

    public void deleteById(Integer id) {
        workOrderRepository.deleteById(id);
    }
    
    public long count() {
        return workOrderRepository.count();
    }
}
