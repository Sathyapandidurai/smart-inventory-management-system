package com.smartinventory.inventory.service;

import com.smartinventory.inventory.entity.Sale;
import com.smartinventory.inventory.repository.SaleRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Map<String, Object> getSalesSummary() {

        List<Sale> sales = saleRepository.findAll();

        long totalTransactions = sales.size();

        int totalItemsSold = sales.stream()
                .mapToInt(Sale::getQuantitySold)
                .sum();

        double totalRevenue = sales.stream()
                .mapToDouble(Sale::getTotalAmount)
                .sum();

        return Map.of(
                "totalTransactions", totalTransactions,
                "totalItemsSold", totalItemsSold,
                "totalRevenue", totalRevenue
        );
    }
}