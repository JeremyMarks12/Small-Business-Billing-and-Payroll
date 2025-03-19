package com.SBA.BillingSystem;

import jakarta.persistence.*;



@Entity
@Table(name = "woItems")
public class woItems {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
	private int woItemsID;
	private String woItems;
	private int woItemQty;
	private double woItemPrice;
	private int workerID;
	private int workOrderID;
	public int getWorkOrderID() {
		return workOrderID;
	}

	public void setWorkOrderID(int workOrderID) {
		this.workOrderID = workOrderID;
	}

	private int companyID;
	private String work_orderPDF;	// This should be an a file type... Fix as needed.
	
	public woItems() {
	}
	
	public woItems(int woItemsID, String woItems, int woItemQty, double woItemPrice, int workerID, int workOrderID, int companyID,
			String work_orderPDF) {
		this.woItemsID = woItemsID;
		this.woItems = woItems;
		this.woItemQty = woItemQty;
		this.woItemPrice = woItemPrice;
		this.workerID = workerID;
		this.workOrderID = workOrderID;
		this.companyID = companyID;
		this.work_orderPDF = work_orderPDF;
	}

	public int getwoItemsID() {
		return woItemsID;
	}

	public void setwoItemsID(int woItemsID) {
		this.woItemsID = woItemsID;
	}

	public String getWoItems() {
		return woItems;
	}

	public void setWoItems(String woItems) {
		this.woItems = woItems;
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

	public String getWork_orderPDF() {
		return work_orderPDF;
	}

	public void setWork_orderPDF(String work_orderPDF) {
		this.work_orderPDF = work_orderPDF;
	}
	
	

}
