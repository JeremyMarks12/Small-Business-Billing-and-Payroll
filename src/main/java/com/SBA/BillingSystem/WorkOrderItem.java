package com.SBA.BillingSystem;

import jakarta.persistence.*;

@Entity
@Table(name = "workOrderItem")
public class WorkOrderItem {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
	private int WorkOrderItemID;
    
	private String WorkOrderItem;
	private int WorkOrderItemQty;
	private double WorkOrderItemPrice;
	private int workerID;
	private int workOrderID;
	private int companyID;

	public WorkOrderItem() {}
	
	public WorkOrderItem(int WorkOrderItemID, 
			String WorkOrderItem, 
			int WorkOrderItemQty, 
			double WorkOrderItemPrice, 
			int workerID, 
			int workOrderID, 
			int companyID) 
	{
		this.WorkOrderItemID = WorkOrderItemID;
		this.WorkOrderItem = WorkOrderItem;
		this.WorkOrderItemQty = WorkOrderItemQty;
		this.WorkOrderItemPrice = WorkOrderItemPrice;
		this.workerID = workerID;
		this.workOrderID = workOrderID;
		this.companyID = companyID;

	}
	
	// Organize!
	public int getWorkOrderItemID() {
		return WorkOrderItemID;
	}
	
	public String getWorkOrderItem() {
		return WorkOrderItem;
	}
	public int getWorkOrderItemQty() {
		return WorkOrderItemQty;
	}
	public double getWorkOrderItemPrice() {
		return WorkOrderItemPrice;
	}
	public int getWorkerID() {
		return workerID;
	}
	public int getWorkOrderID() {
		return workOrderID;
	}
	
	public void setWorkOrderID(int workOrderID) {
		this.workOrderID = workOrderID;
	}

	public int getCompanyID() {
		return companyID;
	}

	public void setWorkOrderItemID(int WorkOrderItemID) {
		this.WorkOrderItemID = WorkOrderItemID;
	}

	public void setWorkOrderItem(String WorkOrderItem) {
		this.WorkOrderItem = WorkOrderItem;
	}

	public void setWorkOrderItemQty(int WorkOrderItemQty) {
		this.WorkOrderItemQty = WorkOrderItemQty;
	}

	public void setWorkOrderItemPrice(double WorkOrderItemPrice) {
		this.WorkOrderItemPrice = WorkOrderItemPrice;
	}

	public void setWorkerID(int workerID) {
		this.workerID = workerID;
	}

	public void setCompanyID(int companyID) {
		this.companyID = companyID;
	}
}
