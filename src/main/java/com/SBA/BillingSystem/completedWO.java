package com.SBA.BillingSystem;

import jakarta.persistence.*;

// **** Redundant class. Delete and incorporate into regular work order class.
// **** Depreciated

@Entity
@Table(name = "completedWO")
public class completedWO {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
	private int completedWOID;
	private int companyID;
	private int fileNo;
	private double myPrice;
	private double SBATotal;
	private String assessment;
	private String plat;
	private String address;
	private String woDate;
	
	public completedWO() {
	}
	
	public completedWO(int completedWOID, int companyID, int fileNo, double myPrice, double SBATotal, String assessment,
			String plat, String address, String woDate) {
		this.completedWOID = completedWOID;
		this.companyID = companyID;
		this.fileNo = fileNo;
		this.myPrice = myPrice;
		this.SBATotal = SBATotal;
		this.assessment = assessment;
		this.plat = plat;
		this.address = address;
		this.woDate = woDate;
	}

	public int getCompletedWOID() {
		return completedWOID;
	}

	public void setCompletedWOID(int completedWOID) {
		this.completedWOID = completedWOID;
	}

	public int getCompanyID() {
		return companyID;
	}

	public void setCompanyID(int companyID) {
		this.companyID = companyID;
	}

	public int getFileNo() {
		return fileNo;
	}

	public void setFileNo(int fileNo) {
		this.fileNo = fileNo;
	}

	public double getMyPrice() {
		return myPrice;
	}

	public void setMyPrice(double myPrice) {
		this.myPrice = myPrice;
	}

	public double getSBATotal() {
		return SBATotal;
	}

	public void setSBATotal(double sBATotal) {
		SBATotal = sBATotal;
	}

	public String getAssessment() {
		return assessment;
	}

	public void setAssessment(String assessment) {
		this.assessment = assessment;
	}

	public String getPlat() {
		return plat;
	}

	public void setPlat(String plat) {
		this.plat = plat;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getWoDate() {
		return woDate;
	}

	public void setWoDate(String woDate) {
		this.woDate = woDate;
	}
	
	

}
