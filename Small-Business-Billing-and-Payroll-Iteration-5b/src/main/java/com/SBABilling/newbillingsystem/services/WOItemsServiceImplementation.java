package com.SBABilling.newbillingsystem.services;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import com.SBABilling.newbillingsystem.models.*;
import com.SBABilling.newbillingsystem.repositories.*;

@Service
public class WOItemsServiceImplementation implements WOItemsService {

    @Autowired
    private WOItemsRepository woitemsRepository;

    @Override
    public WOItems saveBillingInfo(WOItems billingForm) {
        return woitemsRepository.save(billingForm);
    }

    @Override
    public java.util.List<WOItems> getAllWOItems() {
        return woitemsRepository.findAll();
    }

    public void deleteById(int id) {
        woitemsRepository.deleteById(id);
    }

}
