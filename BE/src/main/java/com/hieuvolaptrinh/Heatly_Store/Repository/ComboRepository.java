package com.hieuvolaptrinh.Heatly_Store.Repository;

import com.hieuvolaptrinh.Heatly_Store.Model.Combo;
import com.hieuvolaptrinh.Heatly_Store.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComboRepository extends JpaRepository<Combo, Integer> {
    List<Combo> findComoByProduct(Product product);
}
