package com.smartinventory.inventory.controller;

import com.smartinventory.inventory.entity.Sale;
import com.smartinventory.inventory.service.SaleService;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/summary")
    public Map<String, Object> getSalesSummary() {
        return saleService.getSalesSummary();
    }
}