package com.SBABilling.newbillingsystem.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.services.*;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping("/add")
    public String addCompany(@RequestBody Company company) {
        companyService.saveCompany(company);
        return "New company added";
    }

    @GetMapping("/all")
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @PutMapping("/{id}")
    public String updateCompany(@PathVariable int id, @RequestBody Company company) {
        Company updated = companyService.updateCompany(id, company);
        return updated != null ? "Company updated" : "Company not found";
    }

    @DeleteMapping("/{id}")
    public String deleteCompany(@PathVariable int id) {
        companyService.deleteCompany(id);
        return "Company deleted";
    }




}
