
package com.smartinventory.inventory.repository;

import com.smartinventory.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
List<Product> findByNameContainingIgnoreCase(String name);

List<Product> findByCategoryContainingIgnoreCase(String category);
   @Query("SELECT p FROM Product p WHERE p.quantity <= p.minimumStock")
List<Product> findLowStockProducts();
}
