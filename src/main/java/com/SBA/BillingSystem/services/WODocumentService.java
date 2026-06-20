package com.SBA.BillingSystem.services;

import java.util.*;
import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.entities.WorkOrderDocument;
import com.SBA.BillingSystem.repositories.WODocumentRepository;

@Service
public class WODocumentService {

	private final WODocumentRepository repository;

    public WODocumentService(WODocumentRepository repository) {
        this.repository = repository;
    }

    public List<WorkOrderDocument> findAll() {
        return repository.findAll();
    }

    public Optional<WorkOrderDocument> findById(Integer id) {
        return repository.findById(id);
    }

    public WorkOrderDocument save(WorkOrderDocument document) {
        return repository.save(document);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}