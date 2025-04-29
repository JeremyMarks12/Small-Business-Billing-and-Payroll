package com.SBABilling.newbillingsystem.services;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.repositories.*;

@Service
public class CompanyServiceImplementation  implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public Optional<Company> getCompanyById(int id) {
        return companyRepository.findById(id);
    }

    @Override
    public Company updateCompany(int id, Company updatedCompany) {
        Optional<Company> existing = companyRepository.findById(id);
        if (existing.isPresent()) {
            Company company = existing.get();
            company.setName(updatedCompany.getName());
            company.setAddress(updatedCompany.getAddress());
            company.setPhoneNumber(updatedCompany.getPhoneNumber());
            return companyRepository.save(company);
        }

        return null;
    }

    @Override
    public void deleteCompany(int id) {
        companyRepository.deleteById(id);
    }

}
