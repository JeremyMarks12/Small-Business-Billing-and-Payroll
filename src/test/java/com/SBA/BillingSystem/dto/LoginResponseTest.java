package com.SBA.BillingSystem.dto;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class LoginResponseTest {

    @Test
    void constructorStoresWorkerInformation() {
        LoginResponse response =
                new LoginResponse(7, "plee", "Pat", "Lee", true);

        assertAll(
                () -> assertEquals(7, response.getWorkerID()),
                () -> assertEquals("plee", response.getWorkerUser()),
                () -> assertEquals("Pat", response.getWorkerFName()),
                () -> assertEquals("Lee", response.getWorkerLName()),
                () -> assertTrue(response.isAdmin()));
    }
}
