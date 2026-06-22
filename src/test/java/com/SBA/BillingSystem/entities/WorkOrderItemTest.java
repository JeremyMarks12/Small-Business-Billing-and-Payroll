package com.SBA.BillingSystem.entities;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import org.junit.jupiter.api.Test;

class WorkOrderItemTest {

    @Test
    void constructorSetsItemDetails() {
        WorkOrder workOrder = new WorkOrder();
        WorkOrderItem item = new WorkOrderItem("Replacement valve", 3, 24.99, workOrder);

        assertAll(
                () -> assertEquals("Replacement valve", item.getItemName()),
                () -> assertEquals(3, item.getQuantity()),
                () -> assertEquals(24.99, item.getPrice()),
                () -> assertSame(workOrder, item.getWorkOrder()));
    }

    @Test
    void settersUpdateItemDetails() {
        WorkOrderItem item = new WorkOrderItem();
        WorkOrder workOrder = new WorkOrder();

        item.setWorkOrderItemID(15);
        item.setItemName("Labor");
        item.setQuantity(2);
        item.setPrice(85.50);
        item.setWorkOrder(workOrder);

        assertAll(
                () -> assertEquals(15, item.getWorkOrderItemID()),
                () -> assertEquals("Labor", item.getItemName()),
                () -> assertEquals(2, item.getQuantity()),
                () -> assertEquals(85.50, item.getPrice()),
                () -> assertSame(workOrder, item.getWorkOrder()));
    }
}
