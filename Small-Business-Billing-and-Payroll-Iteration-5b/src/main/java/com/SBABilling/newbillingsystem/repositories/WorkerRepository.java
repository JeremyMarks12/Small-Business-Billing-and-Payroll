package com.SBABilling.newbillingsystem.repositories;

import java.util.*;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import com.SBABilling.newbillingsystem.models.*;

@Repository
public interface WorkerRepository extends JpaRepository <Worker, Integer>{

    Optional<Worker> findByUsername(String username); // This method is needed to look up the user in the database during login.

}
