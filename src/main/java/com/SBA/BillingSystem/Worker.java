package com.SBA.BillingSystem;

import jakarta.persistence.*; // Defines how objects will map to the DB

@Entity
@Table(name = "Worker") // Maps the worker class to the worker table in the DB
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AutoGenerates an ID
    private int workerID;

    @Column(name = "workerFName")
    private String workerFName;

    @Column(name = "workerLName")
    private String workerLName;

    @Column(name = "workerUser")
    private String workerUser;

    @Column(name = "workerPW")
    private String workerPW;

    @Column(name = "isAdmin")
    private Boolean isAdmin;

    public Worker() {
    }

    public Worker(int workerID, String workerFName, String workerLName, String workerUser, String workerPW, boolean isAdmin) {
        this.workerID = workerID;
        this.workerFName = workerFName;
        this.workerLName = workerLName;
        this.workerUser = workerUser;
        this.workerPW = workerPW;
        this.isAdmin = isAdmin;
    }


    public String getworkerFName() {
        return workerFName;
    }
    
    public String getworkerPW() {
        return workerPW;
    }
    
    public int getWorkerID() {
        return workerID;
    }
    
    public String getworkerLName() {
        return workerLName;
    }
    
	public String getWorkerUser() {
		return workerUser;
	}


    public void setworkerFName(String workerFName) {
        this.workerFName = workerFName;
    }

    
    public void setWorkerID(int workerID) {
        this.workerID = workerID;
    }


    public void setworkerLName(String workerLName) {
        this.workerLName = workerLName;
    }


    public void setworkerPW(String workerPW) {
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

//    public void login(String workerPW, String workerPW) {
//        // Logic for parsing db to match the workerPW and workerPW to worker.
//    }

    public void logout() {
        // Logic for logging out of the system.
        System.out.println("Sucessfully logged out.");
    }












}
