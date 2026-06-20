package com.SBA.BillingSystem.services;

import java.util.*;
import org.springframework.stereotype.Service;
import com.SBA.BillingSystem.entities.Company;
import com.SBA.BillingSystem.repositories.CompanyRepository;

@Service
public class CompanyService{

	 private final CompanyRepository companyRepository;

	    public CompanyService(CompanyRepository companyRepository) {
	        this.companyRepository = companyRepository;
	    }

	    public List<Company> findAll() {
	        return companyRepository.findAll();
	    }

	    public Optional<Company> findById(Integer id) {
	        return companyRepository.findById(id);
	    }

	    public Company save(Company company) {
	        return companyRepository.save(company);
	    }

	    public void deleteById(Integer id) {
	        companyRepository.deleteById(id);
	    }
}