package com.SBA.BillingSystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SBA.BillingSystem.entities.WorkOrder;
import com.SBA.BillingSystem.entities.Worker;
import com.SBA.BillingSystem.enums.WorkOrderStatus;
import com.SBA.BillingSystem.repositories.WorkerRepository;
import com.SBA.BillingSystem.repositories.WorkOrderRepository;

@Service
public class WorkOrderService{

    private final WorkOrderRepository workOrderRepository;
    private final WorkerRepository workerRepository;

    public WorkOrderService(WorkOrderRepository workOrderRepository, WorkerRepository workerRepository) {
        this.workOrderRepository = workOrderRepository;
        this.workerRepository = workerRepository;
    }
    
    @Transactional
    public WorkOrder startWorkOrder(Integer workOrderID) {
    	WorkOrder workOrder = getRequiredWorkOrder(workOrderID);
    	
    	if(workOrder.getStatus() != WorkOrderStatus.OPEN) {
    		throw new IllegalStateException("Only open work orders can be started");
    	}
    	
    	workOrder.setStatus(WorkOrderStatus.IN_PROCESS);
    	
    	return workOrderRepository.save(workOrder);
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

    public WorkOrder createWorkOrder(WorkOrder workOrder) {
    	workOrder.setWorkOrderID(0);
    	workOrder.setStatus(WorkOrderStatus.OPEN);
    	
        return workOrderRepository.save(workOrder);
    }

    @Transactional
    public WorkOrder reassignWorkOrder(Integer workOrderID, Integer workerID) {
        WorkOrder workOrder = getRequiredWorkOrder(workOrderID);

        if (workOrder.getStatus() == WorkOrderStatus.COMPLETE) {
            throw new IllegalStateException("Completed work orders cannot be reassigned");
        }

        Worker worker = workerRepository.findById(workerID)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found"));

        workOrder.getWorkers().clear();
        workOrder.addWorker(worker);

        return workOrderRepository.save(workOrder);
    }

    @Transactional
    public void deleteById(Integer id) {
        WorkOrder workOrder = getRequiredWorkOrder(id);
        workOrderRepository.delete(workOrder);
    }
    
    public long count() {
        return workOrderRepository.count();
    }
    
    // Work order add/delete/submit stuff
    
    @Transactional
    public WorkOrder submitForReview(Integer workOrderID) {
    	WorkOrder workOrder = getRequiredWorkOrder(workOrderID);
    	
    	if (workOrder.getStatus() != WorkOrderStatus.IN_PROCESS) {
    		throw new IllegalStateException("Only work orders in process can be submitted");
    	}
    	
    	workOrder.setStatus(WorkOrderStatus.IN_REVIEW);
    	
    	return workOrderRepository.save(workOrder);
    }
    
    @Transactional
    public WorkOrder approveWorkOrder(Integer workOrderID) {
    	WorkOrder workOrder = getRequiredWorkOrder(workOrderID);
    	
    	if(workOrder.getStatus() != WorkOrderStatus.IN_REVIEW) {
    		throw new IllegalStateException("Only work orders under review can be approved");
    	}
    	
    	validateForCompletion(workOrder);
    	workOrder.setStatus(WorkOrderStatus.COMPLETE);
    	
    	return workOrderRepository.save(workOrder);
    }
    
    @Transactional
    public WorkOrder rejectWorkOrder(Integer workOrderID) {
    	WorkOrder workOrder = getRequiredWorkOrder(workOrderID);
    	
    	if(workOrder.getStatus() != WorkOrderStatus.IN_REVIEW) {
    		throw new IllegalStateException("Only work orders under review can be rejected");
    	}
    	
        workOrder.setStatus(WorkOrderStatus.IN_PROCESS);
        
        return workOrderRepository.save(workOrder);
    }
    
    // Private Helper for getting Required Work Order
    private WorkOrder getRequiredWorkOrder(Integer workOrderId) {
        Optional<WorkOrder> result =
                workOrderRepository.findById(workOrderId);

        if (result.isEmpty()) {
            throw new IllegalArgumentException("Work order not found");
        }

        return result.get();
    }
    
    private void validateForCompletion(WorkOrder workOrder) {
        if (workOrder.getWorkOrderID() <= 0) {
            throw new IllegalStateException("Work order ID is required");
        }

        if (workOrder.getWorkers() == null ||
                workOrder.getWorkers().isEmpty()) {
            throw new IllegalStateException("At least one worker must be assigned");
        }

        if (workOrder.getCompany() == null ||
                workOrder.getCompany().getCompanyID() <= 0) {
            throw new IllegalStateException(
                    "A valid company must be assigned");
        }

        if (workOrder.getStartDateTime() == null) {
            throw new IllegalStateException("Start date and time are required");
        }

        if (workOrder.getEndDateTime() == null) {
            throw new IllegalStateException("End date and time are required");
        }

        if (workOrder.getItems() == null ||
                workOrder.getItems().isEmpty()) {
            throw new IllegalStateException("At least one item is required");
        }
    }
}
