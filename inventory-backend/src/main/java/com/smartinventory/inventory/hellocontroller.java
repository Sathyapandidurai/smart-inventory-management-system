package com.smartinventory.inventory;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class hellocontroller {

    @GetMapping("/api/hello")
    public String hello() {
        return "Smart Inventory Management System is Running!";
    }
}
