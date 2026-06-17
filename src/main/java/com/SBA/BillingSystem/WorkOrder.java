package com.SBA.BillingSystem;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "workOrder")
public class WorkOrder {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int WorkOrderID;
    
    private int workerID;
    private int companyID;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private WorkOrderStatus status = WorkOrderStatus.OPEN;
    
    @Column( nullable = false)
    private LocalDateTime startDateTime = LocalDateTime.now();
    private LocalDateTime endDateTime;
	private String comment;
	
	public WorkOrder() {}
	
	public WorkOrder(int WorkOrderID, 
			int workerID, 
			int companyID, 
			WorkOrderStatus status, 
			LocalDateTime startDateTime, 
			LocalDateTime endDateTime,
			String comment) 
	{
		this.WorkOrderID = WorkOrderID;
		this.workerID = workerID;
		this.companyID = companyID;
		this.status = status;	//Added
		this.startDateTime = startDateTime;	//Added
		this.endDateTime = endDateTime;	//Added
		this.comment = comment;	//Added
		
	}
	
	public int getWorkOrderID() {
		return WorkOrderID;
	}
	
	public int getWorkerID() {
		return workerID;
	}
	
	public int getCompanyID() {
		return companyID;
	}
	
	public WorkOrderStatus getStatus() {
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

	public void setWorkOrderID(int WorkOrderID) {
		this.WorkOrderID = WorkOrderID;
	}
	
	public void setWorkerID(int workerID) {
		this.workerID = workerID;
	}
	
	public void setCompanyID(int companyID) {
		this.companyID = companyID;
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

	public void setComment(String comment) {
		this.comment = comment;
	}

}
