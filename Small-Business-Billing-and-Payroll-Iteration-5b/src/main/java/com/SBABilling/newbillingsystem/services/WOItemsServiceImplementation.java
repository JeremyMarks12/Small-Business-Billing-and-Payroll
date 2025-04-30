package com.SBABilling.newbillingsystem.services;

import java.time.LocalDate;
import java.util.List;

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
        // Calculate inspector pay before saving
        if (billingForm.getInspectorPay() == 0) {
            billingForm.setInspectorPay(billingForm.getMyPrice() - billingForm.getSBATotal());
        }
        return woitemsRepository.save(billingForm);
    }

    @Override
    public java.util.List<WOItems> getAllWOItems() {
        // Get all items and ensure inspector pay is calculated correctly
        List<WOItems> items = woitemsRepository.findAll();
        items.forEach(item -> {
            if (item.getInspectorPay() == 0) {
                item.setInspectorPay(item.getMyPrice() - item.getSBATotal());
            }
        });
        return items;
    }

    @Override
    public void deleteById(int id) {
        woitemsRepository.deleteById(id);
    }

    @Override
    public List<WOItems> getWOItemsByInspectorName(String inspectorName) {
        // Calculate inspector pay for all items
        List<WOItems> items = woitemsRepository.findByName(inspectorName);
        items.forEach(item -> {
            if (item.getInspectorPay() == 0) {
                item.setInspectorPay(item.getMyPrice() - item.getSBATotal());
            }
        });
        return items;
    }

    @Override
    public List<WOItems> getWOItemsByDateRange(LocalDate startDate, LocalDate endDate) {
        // Calculate inspector pay for all items
        List<WOItems> items = woitemsRepository.findByDateBetween(startDate, endDate);
        items.forEach(item -> {
            if (item.getInspectorPay() == 0) {
                item.setInspectorPay(item.getMyPrice() - item.getSBATotal());
            }
        });
        return items;
    }

    @Override
    public List<WOItems> getWOItemsByInspectorNameAndDateRange(String inspectorName, LocalDate startDate, LocalDate endDate) {
        // Calculate inspector pay for all items
        List<WOItems> items = woitemsRepository.findByNameAndDateBetween(inspectorName, startDate, endDate);
        items.forEach(item -> {
            if (item.getInspectorPay() == 0) {
                item.setInspectorPay(item.getMyPrice() - item.getSBATotal());
            }
        });
        return items;
    }
}