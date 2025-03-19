package com.SBA.BillingSystem.repositories;

import org.springframework.stereotype.Repository;
import com.SBA.BillingSystem.workOrder;

@Repository
public interface workOrderRepository extends GenericRepository<workOrder, Integer> {
	workOrder findByCompanyID(Integer companyID);
}