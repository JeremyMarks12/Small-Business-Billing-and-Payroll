package com.SBABilling.newbillingsystem.models;

import java.time.*;

import jakarta.persistence.*;

@Entity
public class WOItems {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    private String name;
    private String company;
    private String fileNumber;
    private double myPrice;
    private double sBATotal;
    private int plat;
    private String assessment;
    private String comments;
    private String address;
    private LocalDate date;


    public WOItems() {
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

    public void setMyPrice(float myPrice) {
        this.myPrice = myPrice;
    }

    public double getSBATotal() {
        return sBATotal;
    }

    public void setSBATotal(int sBATotal) {
        this.sBATotal = sBATotal;
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

    public void setAssignedDate(LocalDate date) {
        this.date = date;
    }



}
