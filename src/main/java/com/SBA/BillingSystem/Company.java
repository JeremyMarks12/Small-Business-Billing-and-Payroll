package com.SBA.BillingSystem;

public class Company {
	
	private int companyID;
	private String companyName;
	private String companyAddress;
	private String companyPhone;
	private String companyEmail;

	public Company() {
	}

	public Company(int companyID, String companyName, String companyAddress, String companyPhone, String companyEmail) {
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

	public String getCompanyPhone() {
		return companyPhone;
	}

	public String getCompanyEmail() {
        return companyEmail;
    }

	public void setCompanyID(int companyID) {
		this.companyID = companyID;
	}

}
