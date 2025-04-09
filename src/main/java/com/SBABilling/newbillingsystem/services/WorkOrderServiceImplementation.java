package com.SBABilling.newbillingsystem.services;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.repositories.*;


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