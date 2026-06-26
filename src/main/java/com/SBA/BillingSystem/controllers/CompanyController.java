package com.SBA.BillingSystem.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SBA.BillingSystem.entities.Company;
import com.SBA.BillingSystem.services.CompanyService;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/all")
    public List<Company> getAllCompanies() {
        return companyService.findActive();
    }

    @GetMapping("/all-with-archived")
    public List<Company> getAllCompaniesIncludingArchived() {
        return companyService.findAll();
    }

    @GetMapping
    public List<Company> getActiveCompanies() {
        return companyService.findActive();
    }

    @GetMapping("/archived")
    public List<Company> getArchivedCompanies() {
        return companyService.findArchived();
    }

    @PostMapping("/add")
    public Company addCompany(@RequestBody Company company) {
        return companyService.save(company);
    }

    @PutMapping("/{id}")
    public Company updateCompany(@PathVariable Integer id, @RequestBody Company company) {
        return companyService.update(id, company);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archiveCompany(@PathVariable Integer id) {
        companyService.archiveById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/restore")
    public Company restoreCompany(@PathVariable Integer id) {
        return companyService.restoreById(id);
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteCompanyPermanently(@PathVariable Integer id) {
        companyService.deletePermanentlyById(id);
        return ResponseEntity.noContent().build();
    }
}
