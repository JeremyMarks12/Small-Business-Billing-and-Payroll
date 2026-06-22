package com.SBA.BillingSystem.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.SBA.BillingSystem.entities.Company;
import com.SBA.BillingSystem.entities.WorkOrder;

@DataJpaTest
class WorkOrderRepositoryTest {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Test
    void findByCompanyIdReturnsOnlyOrdersForRequestedCompany() {
        Company firstCompany = companyRepository.saveAndFlush(
                new Company("First", "1 Main Street", "555-0001", "first@test.com"));
        Company secondCompany = companyRepository.saveAndFlush(
                new Company("Second", "2 Main Street", "555-0002", "second@test.com"));

        WorkOrder firstOrder = new WorkOrder();
        firstOrder.setCompany(firstCompany);
        WorkOrder secondOrder = new WorkOrder();
        secondOrder.setCompany(secondCompany);
        workOrderRepository.saveAllAndFlush(java.util.List.of(firstOrder, secondOrder));

        assertThat(workOrderRepository.findByCompany_CompanyID(firstCompany.getCompanyID()))
                .containsExactly(firstOrder);
    }

    @Test
    void findByCompanyIdReturnsEmptyListForUnknownCompany() {
        assertThat(workOrderRepository.findByCompany_CompanyID(999)).isEmpty();
    }

    @Test
    void saveAndDeleteWorkOrder() {
        WorkOrder saved = workOrderRepository.saveAndFlush(new WorkOrder());

        assertThat(saved.getWorkOrderID()).isPositive();

        workOrderRepository.delete(saved);
        workOrderRepository.flush();

        assertThat(workOrderRepository.findById(saved.getWorkOrderID())).isEmpty();
    }
}
