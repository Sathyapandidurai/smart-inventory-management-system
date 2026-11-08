package com.smartinventory.inventory.controller;

import com.smartinventory.inventory.entity.Product;
import com.smartinventory.inventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
@GetMapping("/search")
public List<Product> searchProducts(@RequestParam String name) {
    return productService.searchByName(name);
}

@GetMapping("/search/category")
public List<Product> searchByCategory(
        @RequestParam String category) {
    return productService.searchByCategory(category);
}
    // Add a new product
    @PostMapping
public Product addProduct(@Valid @RequestBody Product product) {
    return productService.addProduct(product);
}
    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Update product
   @PutMapping("/{id}")
public Product updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody Product product) {

    return productService.updateProduct(id, product);
}

    // Delete product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted successfully!";
    }
// Get low-stock products
// Get low-stock products
@GetMapping("/low-stock")
public List<Product> getLowStockProducts() {
    return productService.getLowStockProducts();
}
@PostMapping("/{id}/stock-in")
public Product stockIn(
        @PathVariable Long id,
        @RequestParam int quantity) {
    return productService.stockIn(id, quantity);
}// Remove stock from a product
@PostMapping("/{id}/stock-out")
public Product stockOut(
        @PathVariable Long id,
        @RequestParam int quantity) {

    return productService.stockOut(id, quantity);
}// Get inventory summary
@GetMapping("/summary")
public Map<String, Object> getInventorySummary() {
    return productService.getInventorySummary();
}
}
