package com.SBA.BillingSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;


@NoRepositoryBean  // Prevents Spring from trying to create an instance
public interface GenericRepository<T, ID> extends JpaRepository<T, ID> {
    // No need for custom queries - all entities will use this!

}