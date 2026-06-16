package com.SBA.BillingSystem;

import jakarta.persistence.*;



@Entity
@Table(name = "woItem")
public class woItem {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
	private int woItemID;
	private String woItem;
	private int woItemQty;
	private double woItemPrice;
	private int workerID;
	private int workOrderID;
	private int companyID;

	public woItem() {
	}
	
	public woItem(int woItemID, 
			String woItem, 
			int woItemQty, 
			double woItemPrice, 
			int workerID, 
			int workOrderID, 
			int companyID,
			String work_orderPDF) 
	{
		this.woItemID = woItemID;
		this.woItem = woItem;
		this.woItemQty = woItemQty;
		this.woItemPrice = woItemPrice;
		this.workerID = workerID;
		this.workOrderID = workOrderID;
		this.companyID = companyID;

	}
	
	// Organize!
	
	public int getWorkOrderID() {
		return workOrderID;
	}

	public void setWorkOrderID(int workOrderID) {
		this.workOrderID = workOrderID;
	}


	public int getwoItemID() {
		return woItemID;
	}

	public void setwoItemID(int woItemID) {
		this.woItemID = woItemID;
	}

	public String getwoItem() {
		return woItem;
	}
	

	public void setwoItem(String woItem) {
		this.woItem = woItem;
	}

	public int getWoItemQty() {
		return woItemQty;
	}

	public void setWoItemQty(int woItemQty) {
		this.woItemQty = woItemQty;
	}

	public double getWoItemPrice() {
		return woItemPrice;
	}

	public void setWoItemPrice(double woItemPrice) {
		this.woItemPrice = woItemPrice;
	}

	public int getWorkerID() {
		return workerID;
	}

	public void setWorkerID(int workerID) {
		this.workerID = workerID;
	}

	public int getCompanyID() {
		return companyID;
	}

	public void setCompanyID(int companyID) {
		this.companyID = companyID;
	}

}
