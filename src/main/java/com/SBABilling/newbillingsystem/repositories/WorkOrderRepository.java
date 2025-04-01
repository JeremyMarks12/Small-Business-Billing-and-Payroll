package com.SBABilling.newbillingsystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SBABilling.newbillingsystem.models.WorkOrder;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Integer>{

	// public WorkOrder findByCompanyID(Integer companyID);
}
