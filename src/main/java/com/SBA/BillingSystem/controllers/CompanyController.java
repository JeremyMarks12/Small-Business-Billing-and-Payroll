package com.SBA.BillingSystem.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.SBA.BillingSystem.Company;
import com.SBA.BillingSystem.services.CompanyService;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/all")
    public List<Company> getAllCompanies() {
        return companyService.findAll();
    }

    @PostMapping("/add")
    public Company addCompany(@RequestBody Company company) {
        return companyService.save(company);
    }

    @PutMapping("/{id}")
    public Company updateCompany(@PathVariable Integer id, @RequestBody Company company) {
        company.setCompanyID(id);
        return companyService.save(company);
    }

    @DeleteMapping("/{id}")
    public void deleteCompany(@PathVariable Integer id) {
        companyService.deleteById(id);
    }
}