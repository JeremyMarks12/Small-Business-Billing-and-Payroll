package com.SBA.BillingSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SBA.BillingSystem.entities.WorkOrderItem;

public interface WOItemRepository extends JpaRepository<WorkOrderItem, Integer> {

}
