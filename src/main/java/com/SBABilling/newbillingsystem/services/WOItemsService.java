package com.SBABilling.newbillingsystem.services;

import java.util.*;

import com.SBABilling.newbillingsystem.models.*;

public interface WOItemsService {
    List<WOItems> getAllWOItems();
    WOItems saveBillingInfo(WOItems billingForm);
    void deleteById(int id);
}
