package com.SBA.BillingSystem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SBA.BillingSystem.entities.Company;


public interface CompanyRepository extends JpaRepository<Company, Integer> {
	List<Company> findByArchivedFalse();
	List<Company> findByArchivedTrue();
}
