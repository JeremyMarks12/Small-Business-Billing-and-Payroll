package com.SBA.BillingSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SBA.BillingSystem.entities.WorkOrderDocument;

public interface WODocumentRepository extends JpaRepository<WorkOrderDocument, Integer> {

}
