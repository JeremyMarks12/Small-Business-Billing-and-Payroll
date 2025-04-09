package com.SBABilling.newbillingsystem.models;

import jakarta.persistence.*;

@Entity
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int WorkOrderID;
    private int workerID;
    private int companyID;
    private String WorkOrderPDF;

    public WorkOrder() {
    }

//  public WorkOrder(int WorkOrderID, int workerID, int companyID, String WorkOrderPDF) {
//      this.WorkOrderID = WorkOrderID;
//      this.workerID = workerID;
//      this.companyID = companyID;
//      this.WorkOrderPDF = WorkOrderPDF;
//  }

    public void setWorkOrderID(int WorkOrderID) {
        this.WorkOrderID = WorkOrderID;
    }

    public void setWokerID(int workerID) {
        this.workerID = workerID;
    }

    public void setCompanyID(int companyID) {
        this.companyID = companyID;
    }

    public void setWorkOrderPDF(String WorkOrderPDF) {
        this.WorkOrderPDF = WorkOrderPDF;
    }

    public int getWorkOrderID() {
        return WorkOrderID;
    }

    public int getWOWorkerID() {
        return workerID;
    }

    public int getWOCompanyID() {
        return companyID;
    }

    public String getWorkOrderPDF() {
        return WorkOrderPDF;
    }

}