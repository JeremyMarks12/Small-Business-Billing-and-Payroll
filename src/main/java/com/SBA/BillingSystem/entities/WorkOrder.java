package com.SBA.BillingSystem.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.SBA.BillingSystem.enums.WorkOrderStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "work_order")
public class WorkOrder {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int WorkOrderID;
    
	@ManyToOne
	@JoinColumn(name = "worker_id")
    private Worker worker;
	
	@ManyToOne
	@JoinColumn(name = "company_id")
    private Company company;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private WorkOrderStatus status = WorkOrderStatus.OPEN;
    
    @Column( nullable = false)
    private LocalDateTime startDateTime = LocalDateTime.now();
    
    private LocalDateTime endDateTime;
	private String comment;
	
	// get all items in WO
	@OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<WorkOrderItem> items = new ArrayList<>();
	
	public WorkOrder() {}
	
	public WorkOrder(
			int WorkOrderID, 
			Worker worker, 
			Company company, 
			WorkOrderStatus status, 
			LocalDateTime startDateTime, 
			LocalDateTime endDateTime,
			String comment) 
	{
		this.WorkOrderID = WorkOrderID;
		this.worker = worker;
		this.company = company;
		this.status = status;
		this.startDateTime = startDateTime;
		this.endDateTime = endDateTime;
		this.comment = comment;
		
	}
	
	public int getWorkOrderID() {
		return WorkOrderID;
	}
	
	public Worker getWorker() {
		return worker;
	}
	
	public Company getCompany() {
		return company;
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
	
	public List<WorkOrderItem> getItems() {
	    return items;
	}


	public void setWorkOrderID(int WorkOrderID) {
		this.WorkOrderID = WorkOrderID;
	}
	
	public void setWorkerID(Worker worker) {
		this.worker = worker;
	}
	
	public void setCompanyID(Company company) {
		this.company = company;
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
	
	public void setItems(List<WorkOrderItem> items) {
	    this.items = items;
	}
	
	// Helper methods to add/delete items
	public void addItem(WorkOrderItem item) {
	    items.add(item);
	    item.setWorkOrder(this);
	}

	public void removeItem(WorkOrderItem item) {
	    items.remove(item);
	    item.setWorkOrder(null);
	}
}
