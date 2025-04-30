package com.SBABilling.newbillingsystem.models;

import java.time.*;

import jakarta.persistence.*;

@Entity
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "inspector_id", nullable = false)
    private Worker inspector;

    private LocalDate assignedDate;

    private String pdfPath; // This will be the server path or file reference

    public WorkOrder() {
    }

    public WorkOrder(Worker inspector, LocalDate assignedDate, String pdfPath) {
        this.inspector = inspector;
        this.assignedDate = assignedDate;
        this.pdfPath = pdfPath;
    }

    public int getId() {
        return id;
    }

    public Worker getInspector() {
        return inspector;
    }

    public void setInspector(Worker inspector) {
        this.inspector = inspector;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }
}
