package com.smartinventory.inventory.controller;

import com.smartinventory.inventory.service.ProductService;
import com.smartinventory.inventory.service.SaleService;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final ProductService productService;
    private final SaleService saleService;

    public DashboardController(
            ProductService productService,
            SaleService saleService) {

        this.productService = productService;
        this.saleService = saleService;
    }

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {

        return Map.of(
            "inventory",
            productService.getInventorySummary(),

            "sales",
            saleService.getSalesSummary()
        );
    }
}