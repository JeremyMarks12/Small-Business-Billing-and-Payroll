package com.SBA.BillingSystem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.SBA.BillingSystem.entities.Company;
import com.SBA.BillingSystem.repositories.CompanyRepository;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    @Test
    void findAllReturnsCompaniesFromRepository() {
        List<Company> companies = List.of(new Company(), new Company());
        when(companyRepository.findAll()).thenReturn(companies);

        assertSame(companies, companyService.findAll());
        verify(companyRepository).findAll();
    }

    @Test
    void findByIdReturnsRepositoryResult() {
        Company company = new Company();
        when(companyRepository.findById(1)).thenReturn(Optional.of(company));

        assertEquals(Optional.of(company), companyService.findById(1));
    }

    @Test
    void saveReturnsSavedCompany() {
        Company company = new Company();
        when(companyRepository.save(company)).thenReturn(company);

        assertSame(company, companyService.save(company));
    }

    @Test
    void deleteByIdDelegatesToRepository() {
        companyService.deleteById(1);

        verify(companyRepository).deleteById(1);
    }
}
