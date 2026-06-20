package com.SBA.BillingSystem.services;

import java.util.*;
import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.entities.WorkOrderItem;
import com.SBA.BillingSystem.repositories.WOItemRepository;

@Service
public class WOItemService {
	
	 private final WOItemRepository repository;

	    public WOItemService(WOItemRepository repository) {
	        this.repository = repository;
	    }

	    public List<WorkOrderItem> findAll() {
	        return repository.findAll();
	    }

	    public Optional<WorkOrderItem> findById(Integer id) {
	        return repository.findById(id);
	    }

	    public WorkOrderItem save(WorkOrderItem item) {
	        return repository.save(item);
	    }

	    public void deleteById(Integer id) {
	        repository.deleteById(id);
	    }
}
