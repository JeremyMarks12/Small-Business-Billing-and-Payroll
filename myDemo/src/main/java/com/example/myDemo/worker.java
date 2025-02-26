package com.example.myDemo;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class worker {
    
    @Id
    private Integer workerID;
    private String workerFName;
    private String workerLName;
    private String workerUser;
    private String workerPW;
    private Integer isAdmin;

    // Getters and setters for all fields
    public Integer getWorkerID() {
        return workerID;
    }

    public void setWorkerID(Integer workerID) {
        this.workerID = workerID;
    }

    public String getWorkerFName() {
        return workerFName;
    }

    public void setWorkerFName(String workerFName) {
        this.workerFName = workerFName;
    }

    public String getWorkerLName() {
        return workerLName;
    }

    public void setWorkerLName(String workerLName) {
        this.workerLName = workerLName;
    }

    public String getWorkerUser() {
        return workerUser;
    }

    public void setWorkerUser(String workerUser) {
        this.workerUser = workerUser;
    }

    public String getWorkerPW() {
        return workerPW;
    }

    public void setWorkerPW(String workerPW) {
        this.workerPW = workerPW;
    }

    public Integer getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Integer isAdmin) {
        this.isAdmin = isAdmin;
    }
}
