package com.SBABilling.newbillingsystem.models;

import java.time.*;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class WOItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String company;
    private String fileNumber;
    private double myPrice; // Net Pay

    @JsonProperty("sBATotal") // Explicitly map JSON property to this field
    private double sBATotal;  // SBA Cost
    
    private double inspectorPay; // Added field for inspector pay
    
    private int plat;
    private String assessment;
    private String comments;
    private String address;
    private LocalDate date;

    // Constructor to automatically calculate inspectorPay
    public WOItems() {
        // Default constructor
    }
    
    // Getters and Setters...
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }

    public String getFileNumber() {
        return fileNumber;
    }
    public void setFileNumber(String fileNumber) {
        this.fileNumber = fileNumber;
    }

    public double getMyPrice() {
        return myPrice;
    }
    public void setMyPrice(double myPrice) {
        this.myPrice = myPrice;
        // Automatically update inspectorPay when myPrice is set
        if (this.sBATotal > 0) {
            this.inspectorPay = myPrice - this.sBATotal;
        }
    }

    public double getSBATotal() {
        return sBATotal;
    }
    public void setSBATotal(double sBATotal) {
        this.sBATotal = sBATotal;
        // Automatically update inspectorPay when sBATotal is set
        if (this.myPrice > 0) {
            this.inspectorPay = this.myPrice - sBATotal;
        }
    }
    
    public double getInspectorPay() {
        return inspectorPay;
    }
    public void setInspectorPay(double inspectorPay) {
        this.inspectorPay = inspectorPay;
    }

    public int getPlat() {
        return plat;
    }
    public void setPlat(int plat) {
        this.plat = plat;
    }

    public String getAssessment() {
        return assessment;
    }
    public void setAssessment(String assessment) {
        this.assessment = assessment;
    }

    public String getComments() {
        return comments;
    }
    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    // Pre-persist hook to ensure inspectorPay is calculated before saving
    @PrePersist
    @PreUpdate
    public void calculateInspectorPay() {
        this.inspectorPay = this.myPrice - this.sBATotal;
    }
}