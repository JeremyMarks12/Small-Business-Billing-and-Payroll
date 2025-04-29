package com.SBABilling.newbillingsystem.repositories;

import java.time.*;
import java.util.*;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import com.SBABilling.newbillingsystem.models.*;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Integer> {

    List<WorkOrder> findByInspector_Username(String username);

    List<WorkOrder> findByInspector_UsernameAndAssignedDate(String username, LocalDate assignedDate);
}
