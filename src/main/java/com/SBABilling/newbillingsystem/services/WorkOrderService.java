package com.SBABilling.newbillingsystem.services;

import java.util.*;

import com.SBABilling.newbillingsystem.models.*;


public interface WorkOrderService {

    public WorkOrder saveWorkOrder(WorkOrder WorkOrder);

    public List<WorkOrder> getAllWorkOrders();

    // public WorkOrder findByCompanyID(Integer companyID);

}