package com.SBA.BillingSystem.repositories;

import org.springframework.stereotype.Repository;
import com.SBA.BillingSystem.Company;

@Repository
public interface CompanyRepository extends GenericRepository<Company, Integer> {
}