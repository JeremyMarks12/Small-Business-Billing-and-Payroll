package com.SBA.BillingSystem.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "work_order_item")
public class WorkOrderItem {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
	private int workOrderItemID;
    
    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;
	
	@ManyToOne(optional = false)
	@JoinColumn(name = "work_order_id", nullable = false)
	@JsonIgnore
	private WorkOrder workOrder;

	public WorkOrderItem() {}
	
	public WorkOrderItem(String itemName, int quantity, double price, WorkOrder workOrder) {
		this.itemName = itemName;
		this.quantity = quantity;
		this.price = price;
		this.workOrder = workOrder;
	}
	
	public int getWorkOrderItemID() {
		return workOrderItemID;
	}
	
	public String getItemName() {
		return itemName;
	}
	public int getQuantity() {
		return quantity;
	}
	public double getPrice() {
		return price;
	}

	public WorkOrder getWorkOrder() {
		return workOrder;
	}

	public void setWorkOrderItemID(int WorkOrderItemID) {
		this.workOrderItemID = WorkOrderItemID;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public void setPrice(double price) {
		this.price = price;
	}
	
	public void setWorkOrder(WorkOrder workOrder) {
		this.workOrder = workOrder;
	}
}
