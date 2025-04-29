package com.SBABilling.newbillingsystem.services;

import java.time.*;
import java.util.*;

import com.SBABilling.newbillingsystem.models.*;

public interface WorkOrderService {
    WorkOrder saveWorkOrder(WorkOrder workOrder);

    List<WorkOrder> getAllWorkOrders();

    List<WorkOrder> getWorkOrdersByInspectorName(String inspectorName);

    List<WorkOrder> getWorkOrdersByInspectorNameAndDate(String inspectorName, LocalDate assignmentDate);
}
