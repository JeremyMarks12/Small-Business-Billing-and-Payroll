package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.woItem;
import com.SBA.BillingSystem.repositories.WOItemRepository;

@Service
public class WOItemService extends GenericService<woItem, Integer> {
	
    public WOItemService(WOItemRepository repository) {
        super(repository);
    }
}
