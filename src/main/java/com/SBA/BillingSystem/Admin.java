package com.SBA.BillingSystem;

import java.util.*;

// Redundant class. Delete. Admin privileges are already checked in the Worker class.


public class Admin extends Worker {

    public Admin() {
        super();
    }


//    public Admin(int workerID, String firstName, String lastName, String userName, String password, boolean isAdmin) {
//        super(workerID, firstName, lastName, userName, password, isAdmin);
//    }

    public void createCompanyProfile() {
        // Admin creates a company profile.
    }

    public void deleteComapnyProfile() {
        // Admin is deletes a company profile.
    }

    public void createInspectorProfile() {
        // Admin creates an inspector profile.
    }

    public void updateInspectorProfile() {
        // Admin updates the workers profile.
    }

    public void deleteInspectorProfile() {
        // Admin deletes an inspector profile.
    }

    public void viewAssignedWork(int workerID) {
        // Admin can view the assigned work of a specific worker.
    }

    public void createWorkOrder(int workerID, int CompanyID) {
        // Admin assigns a work order pdf to a worker.
    }

    public void calculateAdminPay() {

    }

    public void calculateTotalPay() {

    }

    public void calculateInspectorPay(Worker worker) {

    }

    public void calculateInspectorPay() {

    }

    public void setMonthlyBill() {

    }

    public void adminExport() {

    }

    public void dateSearch(Date date) {

    }


}
