package com.SBA.BillingSystem;

import java.time.LocalDateTime;
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
    private String workOrderPDF;	// This should be an a file type... Fix as needed.
    
    // Added
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private WorkOrderStatus status = WorkOrderStatus.OPEN;

    // Added
    @Column(name = "startDateTime", nullable = false)
    private LocalDateTime startDateTime = LocalDateTime.now();
    
    // Added
    @Column(name = "endDateTime")
    private LocalDateTime endDateTime;
    
    // Added
    @Column(name = "comment")
	private String comment;
	
	public workOrder() {
	}
	
	public workOrder(int workOrderID, 
			int workerID, 
			int companyID, 
			String workOrderPDF, 
			WorkOrderStatus status, 
			LocalDateTime startDateTime, 
			LocalDateTime endDateTime,
			String comment) 
	{
		this.workOrderID = workOrderID;
		this.workerID = workerID;
		this.companyID = companyID;
		this.workOrderPDF = workOrderPDF;
		this.status = status;	//Added
		this.startDateTime = startDateTime;	//Added
		this.endDateTime = endDateTime;	//Added
		this.comment = comment;	//Added
		
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
	
	public void setStatus(WorkOrderStatus status) {
		this.status = status;
	}
	
	public void setStartDateTime(LocalDateTime startDateTime) {
		this.startDateTime = startDateTime;
	}
	
	public void setEndDateTime(LocalDateTime endDateTime) {
		this.endDateTime = endDateTime;
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
	
	public WorkOrderStatus getWorkOrderStatus() {
		return status;
	}
	
	public LocalDateTime getStartDateTime() {
		return startDateTime;
	}
	
	public LocalDateTime getEndDateTime() {
		return endDateTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
