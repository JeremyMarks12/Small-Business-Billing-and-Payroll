package com.SBA.BillingSystem.repositories;

import org.springframework.stereotype.Repository;
import com.SBA.BillingSystem.WorkOrder;

@Repository
public interface WorkOrderRepository extends GenericRepository<WorkOrder, Integer> {
	WorkOrder findByCompanyID(Integer companyID);
}