package com.SBA.BillingSystem.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class PasswordResetRequestTest {

    @Test
    void storesNewPassword() {
        PasswordResetRequest request = new PasswordResetRequest();

        request.setNewPassword("new-password");

        assertEquals("new-password", request.getNewPassword());
    }
}
