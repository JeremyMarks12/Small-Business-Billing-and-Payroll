package com.SBABilling.newbillingsystem.services;

import java.util.List;

import com.SBABilling.newbillingsystem.models.WorkOrder;


public interface WorkOrderService {
	
	public WorkOrder saveWorkOrder(WorkOrder WorkOrder);
	
	public List<WorkOrder> getAllWorkOrders();
	
    // public WorkOrder findByCompanyID(Integer companyID);

}
