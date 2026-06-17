package com.SBA.BillingSystem.repositories;

import org.springframework.stereotype.Repository;
import com.SBA.BillingSystem.WorkOrderItem;

@Repository
public interface WOItemRepository extends GenericRepository<WorkOrderItem, Integer> {

}
