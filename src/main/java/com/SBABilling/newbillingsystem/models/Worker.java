package com.SBABilling.newbillingsystem.models;
import jakarta.persistence.*;

@Entity
public class Worker {

    @Id // Sets the workerID as the primary key.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto creates the ID and Increments it
    private int workerID;
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private boolean isAdmin;


    public Worker() {

    }


    public int getWorkerID() {
        return workerID;
    }


    public void setWorkerID(int workerID) {
        this.workerID = workerID;
    }


    public String getFirstName() {
        return firstName;
    }


    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }


    public String getLastName() {
        return lastName;
    }


    public void setLastName(String lastName) {
        this.lastName = lastName;
    }


    public String getUsername() {
        return username;
    }


    public void setUsername(String username) {
        this.username = username;
    }


    public String getPassword() {
        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }


    public boolean isAdmin() {
        return isAdmin;
    }


    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }



}
