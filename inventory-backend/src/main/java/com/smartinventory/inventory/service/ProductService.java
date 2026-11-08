package com.smartinventory.inventory.service;

import com.smartinventory.inventory.entity.Product;
import com.smartinventory.inventory.repository.ProductRepository;
import com.smartinventory.inventory.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import com.smartinventory.inventory.entity.Sale;
import com.smartinventory.inventory.repository.SaleRepository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;


@Service
public class ProductService {

    public List<Product> searchByName(String name) {
    return productRepository.findByNameContainingIgnoreCase(name);
}

public List<Product> searchByCategory(String category) {
    return productRepository.findByCategoryContainingIgnoreCase(category);
}

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    // Constructor injection
    public ProductService(ProductRepository productRepository,
                      SaleRepository saleRepository) {
    this.productRepository = productRepository;
    this.saleRepository = saleRepository;
}

    // Add product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
// Get products with low stock
public List<Product> getLowStockProducts() {
    return productRepository.findLowStockProducts();
}

    // Update product
    public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));;

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setMinimumStock(updatedProduct.getMinimumStock());

        return productRepository.save(existingProduct);
    }

    // Delete product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    // Add stock to a product
public Product stockIn(Long id, int quantity) {

    if (quantity <= 0) {
        throw new IllegalArgumentException(
            "Quantity must be greater than zero"
        );
    }

    Product product = productRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));;

    product.setQuantity(product.getQuantity() + quantity);

    return productRepository.save(product);
}


// Remove stock from a product
@Transactional
public Product stockOut(Long id, int quantity) {

    if (quantity <= 0) {
        throw new IllegalArgumentException(
            "Quantity must be greater than zero"
        );
    }

    Product product = productRepository.findById(id)
        .orElseThrow(() ->
            new RuntimeException("Product not found")
        );

    if (product.getQuantity() < quantity) {
        throw new IllegalArgumentException(
            "Insufficient stock available"
        );
    }

    // Reduce available stock
    product.setQuantity(product.getQuantity() - quantity);

    // Create a sales record
    Sale sale = new Sale();
    sale.setProduct(product);
    sale.setQuantitySold(quantity);
    sale.setUnitPrice(product.getPrice());
    sale.setTotalAmount(product.getPrice() * quantity);
    sale.setSaleDate(LocalDateTime.now());

    // Save both changes
    productRepository.save(product);
    saleRepository.save(sale);

    return product;
}
// Get inventory summary
public Map<String, Object> getInventorySummary() {
    

    List<Product> products = productRepository.findAll();

    long totalProducts = products.size();

    int totalStock = products.stream()
            .mapToInt(Product::getQuantity)
            .sum();

    double totalInventoryValue = products.stream()
            .mapToDouble(p -> p.getPrice() * p.getQuantity())
            .sum();

    long lowStockCount = products.stream()
            .filter(p -> p.getQuantity() <= p.getMinimumStock())
            .count();

    return Map.of(
            "totalProducts", totalProducts,
            "totalStock", totalStock,
            "totalInventoryValue", totalInventoryValue,
            "lowStockCount", lowStockCount
    );
}
}
