package com.SBA.BillingSystem.dto;

public class LoginResponse {
    private Integer workerID;
    private String workerUser;
    private String workerFName;
    private String workerLName;
    private String workerEmail;
    private boolean admin;

    public LoginResponse(Integer workerID, String workerUser, String workerFName, String workerLName, String workerEmail, boolean admin) {
        this.workerID = workerID;
        this.workerUser = workerUser;
        this.workerFName = workerFName;
        this.workerLName = workerLName;
        this.workerEmail = workerEmail;
        this.admin = admin;
    }

    public Integer getWorkerID() { return workerID; }
    public String getWorkerUser() { return workerUser; }
    public String getWorkerFName() { return workerFName; }
    public String getWorkerLName() { return workerLName; }
    public String getWorkerEmail() { return workerEmail; }
    public boolean isAdmin() { return admin; }
}
