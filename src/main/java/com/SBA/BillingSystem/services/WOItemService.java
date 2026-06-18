package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;

import com.SBA.BillingSystem.entities.WorkOrderItem;
import com.SBA.BillingSystem.repositories.WOItemRepository;

@Service
public class WOItemService extends GenericService<WorkOrderItem, Integer> {
	
    public WOItemService(WOItemRepository repository) {
        super(repository);
    }
}
