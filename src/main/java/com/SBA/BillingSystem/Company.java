package com.SBA.BillingSystem;

import jakarta.persistence.*;



@Entity
@Table(name = "company")
public class Company {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
	private int companyID;
	private String companyName;
	private String companyAddress;
	private int companyPhone;
	private String companyEmail;

	public Company() {
	}

	public Company(int companyID, String companyName, String companyAddress, int companyPhone, String companyEmail) {
		this.companyID = companyID;
		this.companyName = companyName;
		this.companyAddress = companyAddress;
		this.companyPhone = companyPhone;
		this.companyEmail = companyEmail;
	}

	public int getCompanyID() {
		return companyID;
	}

	public String getCompanyName() {
		return companyName;
	}

	public String getCompanyAddress() {
		return companyAddress;
	}

	public int getCompanyPhone() {
		return companyPhone;
	}

	public String getCompanyEmail() {
        return companyEmail;
    }

	public void setCompanyID(int companyID) {
		this.companyID = companyID;
	}

}
