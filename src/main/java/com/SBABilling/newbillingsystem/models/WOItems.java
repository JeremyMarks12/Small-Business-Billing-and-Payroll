package com.SBABilling.newbillingsystem.models;
import jakarta.persistence.*;

@Entity
public class WOItems {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
	private int WOItemsID;
	private String WOItems;
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
	
	public WOItems() {
	}
	
//	public WOItems(int WOItemsID, String WOItems, int woItemQty, double woItemPrice, int workerID, int workOrderID, int companyID,
//			String work_orderPDF) {
//		this.WOItemsID = WOItemsID;
//		this.WOItems = WOItems;
//		this.woItemQty = woItemQty;
//		this.woItemPrice = woItemPrice;
//		this.workerID = workerID;
//		this.workOrderID = workOrderID;
//		this.companyID = companyID;
//		this.work_orderPDF = work_orderPDF;
//	}

	public int getWOItemsID() {
		return WOItemsID;
	}

	public void setWOItemsID(int WOItemsID) {
		this.WOItemsID = WOItemsID;
	}

	public String getWOItems() {
		return WOItems;
	}

	public void setWOItems(String WOItems) {
		this.WOItems = WOItems;
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
