package com.SBABilling.newbillingsystem.services;

import java.util.*;

import com.SBABilling.newbillingsystem.models.*;

public interface CompanyService {
    Company saveCompany(Company company);
    List<Company> getAllCompanies();
    Optional<Company> getCompanyById(int id);
    Company updateCompany(int id, Company company);
    void deleteCompany(int id);

}
