package com.SBA.BillingSystem;

import jakarta.persistence.*;

@Entity
@Table(name = "workOrder")
public class workOrder {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int workOrderID;
    
    @Column(name = "workerID")
    private int workerID;
    
    @Column(name = "companyID")
    private int companyID;
    
    @Column
    private String workOrderPDF;
    
	public workOrder() {
	}
	
	public workOrder(int workOrderID, int workerID, int companyID, String workOrderPDF) {
		this.workOrderID = workOrderID;
		this.workerID = workerID;
		this.companyID = companyID;
		this.workOrderPDF = workOrderPDF;
	}
	
	public void setWorkOrderID(int workOrderID) {
		this.workOrderID = workOrderID;
	}
	
	public void setWokerID(int workerID) {
		this.workerID = workerID;
	}
	
	public void setCompanyID(int companyID) {
		this.companyID = companyID;
	}
	
	public void setWorkOrderPDF(String workOrderPDF) {
		this.workOrderPDF = workOrderPDF;
	}
	
	public int getWorkOrderID() {
		return workOrderID;
	}
	
	public int getWOWorkerID() {
		return workerID;
	}
	
	public int getWOCompanyID() {
		return companyID;
	}
	
	public String getWorkOrderPDF() {
		return workOrderPDF;
	}

}
