package com.SBABilling.newbillingsystem.repositories;

import org.springframework.data.jpa.repository.*;

import com.SBABilling.newbillingsystem.models.*;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Integer>{

    // public WorkOrder findByCompanyID(Integer companyID);
}