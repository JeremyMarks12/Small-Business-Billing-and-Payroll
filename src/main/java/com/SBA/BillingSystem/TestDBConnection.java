package com.SBA.BillingSystem;

import java.sql.*;

public class TestDBConnection {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/Billing_System";
        String user = "root";
        String password = "Jdm121298$"; // Replace with your MySQL password

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            if (conn != null) {
                System.out.println("✅ Connection to MySQL successful!");
            }
        } catch (SQLException e) {
            System.out.println("❌ Connection failed: " + e.getMessage());
        }
    }
}