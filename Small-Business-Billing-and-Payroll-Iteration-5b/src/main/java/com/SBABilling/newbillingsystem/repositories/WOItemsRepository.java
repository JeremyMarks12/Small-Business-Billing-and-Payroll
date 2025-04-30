package com.SBABilling.newbillingsystem.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.SBABilling.newbillingsystem.models.*;

@Repository
public interface WOItemsRepository extends JpaRepository<WOItems, Integer> {
    // Find items by inspector name
    List<WOItems> findByName(String name);
    
    // Find items by date range
    List<WOItems> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find items by inspector name and date range
    List<WOItems> findByNameAndDateBetween(String name, LocalDate startDate, LocalDate endDate);
}