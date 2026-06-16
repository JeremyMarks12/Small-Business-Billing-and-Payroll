package com.SBA.BillingSystem;

import java.time.LocalDateTime;
import com.SBA.BillingSystem.WorkOrderStatus;

// A summary page for the front end to pull up so it is not constantly searching for the items. Not a query table!

public class WorkOrderSummaryDTO {
	
	private int WorkOrderID;
	private String companyName;
	private String workerName;
	private String workAddress;
	private WorkOrderStatus status;
	private LocalDateTime startDateTime;
	private LocalDateTime endDateTime;
	private String comment;
	private double totalPrice;
	private int fileNo;
	
	public WorkOrderSummaryDTO() {
	}
	
	public WorkOrderSummaryDTO(
			int WorkOrderID,
			String companyName,
			String workerName,
			String workAddress,
			WorkOrderStatus status,
			LocalDateTime startDateTime,
			LocalDateTime endDateTime,
			String comment,
			double totalPrice,
			int fileNo) 
	{
		this.WorkOrderID = WorkOrderID;
		this.setCompanyName(companyName);
		this.setWorkerName(workerName);
		this.setWorkAddress(workAddress);
		this.setStatus(status);
		this.setStartDateTime(startDateTime);
		this.setEndDateTime(endDateTime);
		this.setComment(comment);
		this.setTotalPrice(totalPrice);
		this.setFileNo(fileNo);
		
	}

	public int getWorkOrderID() {
		return WorkOrderID;
	}

	public void setWorkOrderID(int WorkOrderID) {
		this.WorkOrderID = WorkOrderID;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getWorkerName() {
		return workerName;
	}

	public void setWorkerName(String workerName) {
		this.workerName = workerName;
	}

	public String getWorkAddress() {
		return workAddress;
	}

	public void setWorkAddress(String workAddress) {
		this.workAddress = workAddress;
	}

	public WorkOrderStatus getStatus() {
		return status;
	}

	public void setStatus(WorkOrderStatus status) {
		this.status = status;
	}

	public LocalDateTime getStartDateTime() {
		return startDateTime;
	}

	public void setStartDateTime(LocalDateTime startDateTime) {
		this.startDateTime = startDateTime;
	}

	public LocalDateTime getEndDateTime() {
		return endDateTime;
	}

	public void setEndDateTime(LocalDateTime endDateTime) {
		this.endDateTime = endDateTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public int getFileNo() {
		return fileNo;
	}

	public void setFileNo(int fileNo) {
		this.fileNo = fileNo;
	}



}
