package com.SBABilling.newbillingsystem.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SBABilling.newbillingsystem.models.WorkOrder;
import com.SBABilling.newbillingsystem.repositories.WorkOrderRepository;


@Service
public class WorkOrderServiceImplementation implements WorkOrderService {

	@Autowired
    public WorkOrderRepository WorkOrderRepository;

	@Override
	public WorkOrder saveWorkOrder(WorkOrder WorkOrder) {
		return WorkOrderRepository.save(WorkOrder);
	}

	@Override
	public List<WorkOrder> getAllWorkOrders() {
		return WorkOrderRepository.findAll();
	}
}
