package com.SBA.BillingSystem.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class LoginRequestTest {

    @Test
    void storesUsernameAndPassword() {
        LoginRequest request = new LoginRequest();

        request.setUsername("plee");
        request.setPassword("password123");

        assertEquals("plee", request.getUsername());
        assertEquals("password123", request.getPassword());
    }
}
