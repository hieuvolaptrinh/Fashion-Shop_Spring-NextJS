
package com.hieuvolaptrinh.Heatly_Store.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.hieuvolaptrinh.Heatly_Store.Model.Type;

public interface TypeRepository extends JpaRepository<Type, Integer> {
    List<Type> findAllByTypeIdIn(List<Integer> typeIds);

    List<Type> findByTypeName(String typeName);

}
