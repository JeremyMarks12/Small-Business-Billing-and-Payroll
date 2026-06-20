package com.SBA.BillingSystem.repositories;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.SBA.BillingSystem.entities.WorkOrder;

@Repository
public interface WorkOrderRepository extends GenericRepository<WorkOrder, Integer> {
	List<WorkOrder> findByCompany_CompanyID(Integer companyID);
}