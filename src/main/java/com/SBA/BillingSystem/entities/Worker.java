package com.SBA.BillingSystem.entities;

import jakarta.persistence.*; // Defines how objects will map to the DB
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "worker") // Maps the worker class to the worker table in the DB
public class Worker {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
    private int workerID;

    @Column(name = "worker_first_name")
    private String workerFName;

    @Column(name = "worker_last_name")
    private String workerLName;

    @Column(name = "worker_username", unique = true)
    private String workerUser;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "worker_password")
    private String workerPW;
    
    private boolean isAdmin;

    public Worker() {}

    public Worker(String workerFName, String workerLName, String workerUser, String workerPW, boolean isAdmin) 
    {
        this.workerFName = workerFName;
        this.workerLName = workerLName;
        this.workerUser = workerUser;
        this.workerPW = workerPW;
        this.isAdmin = isAdmin;
    }


    public String getWorkerFName() {
        return workerFName;
    }
    
    public String getWorkerPW() {
        return workerPW;
    }
    
    public int getWorkerID() {
        return workerID;
    }
    
    public String getWorkerLName() {
        return workerLName;
    }
    
	public String getWorkerUser() {
		return workerUser;
	}


    public void setWorkerFName(String workerFName) {
        this.workerFName = workerFName;
    }

    
    public void setWorkerID(int workerID) {
        this.workerID = workerID;
    }


    public void setWorkerLName(String workerLName) {
        this.workerLName = workerLName;
    }


    public void setWorkerPW(String workerPW) {
        this.workerPW = workerPW;
    }
    
    public void setWorkerUser(String workerUser) {
    	this.workerUser = workerUser;
    }


    public boolean isAdmin() {
        return Boolean.TRUE.equals(isAdmin);
    }
    

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

}
