package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.woItems;
import com.SBA.BillingSystem.repositories.woItemsRepository;

@Service
public class woItemsService extends GenericService<woItems, Integer> {
	
    public woItemsService(woItemsRepository repository) {
        super(repository);
    }
}
