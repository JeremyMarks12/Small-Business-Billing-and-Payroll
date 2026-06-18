package com.SBA.BillingSystem.services;

import org.springframework.stereotype.Service;

import com.SBA.BillingSystem.entities.Company;
import com.SBA.BillingSystem.repositories.CompanyRepository;

@Service
public class CompanyService extends GenericService<Company, Integer> {

    public CompanyService(CompanyRepository repository) {
        super(repository);
    }
}