package com.SBA.BillingSystem.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.SBA.BillingSystem.entities.Company;
import com.SBA.BillingSystem.services.CompanyService;

@ExtendWith(MockitoExtension.class)
class CompanyControllerTest {

    @Mock
    private CompanyService companyService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new CompanyController(companyService))
                .build();
    }

    @Test
    void getAllCompaniesReturnsCompanies() throws Exception {
        when(companyService.findAll()).thenReturn(List.of(
                new Company("Acme", "100 Main", "555-0100", "office@acme.test")));

        mockMvc.perform(get("/companies/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].companyName").value("Acme"));
    }

    @Test
    void addCompanySavesRequestBody() throws Exception {
        Company saved = new Company("Acme", "100 Main", "555-0100", "office@acme.test");
        saved.setCompanyID(1);
        when(companyService.save(any(Company.class))).thenReturn(saved);

        mockMvc.perform(post("/companies/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "companyName": "Acme",
                                  "companyAddress": "100 Main",
                                  "companyPhone": "555-0100",
                                  "companyEmail": "office@acme.test"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyID").value(1))
                .andExpect(jsonPath("$.companyName").value("Acme"));
    }

    @Test
    void updateCompanyUsesPathId() throws Exception {
        when(companyService.save(any(Company.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(put("/companies/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"companyID": 99, "companyName": "Updated"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyID").value(7));

        ArgumentCaptor<Company> captor = ArgumentCaptor.forClass(Company.class);
        verify(companyService).save(captor.capture());
        org.junit.jupiter.api.Assertions.assertEquals(7, captor.getValue().getCompanyID());
    }

    @Test
    void deleteCompanyDelegatesToService() throws Exception {
        mockMvc.perform(delete("/companies/4"))
                .andExpect(status().isOk());

        verify(companyService).deleteById(4);
    }
}
