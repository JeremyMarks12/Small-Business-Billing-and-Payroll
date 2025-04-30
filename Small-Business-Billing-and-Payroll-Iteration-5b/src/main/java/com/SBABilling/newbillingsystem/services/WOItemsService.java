package com.SBABilling.newbillingsystem.services;

import java.time.LocalDate;
import java.util.*;

import com.SBABilling.newbillingsystem.models.*;

public interface WOItemsService {
    List<WOItems> getAllWOItems();
    WOItems saveBillingInfo(WOItems billingForm);
    void deleteById(int id);
    List<WOItems> getWOItemsByInspectorName(String inspectorName);
    List<WOItems> getWOItemsByDateRange(LocalDate startDate, LocalDate endDate);
    List<WOItems> getWOItemsByInspectorNameAndDateRange(String inspectorName, LocalDate startDate, LocalDate endDate);
}