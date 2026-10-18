
package com.hieuvolaptrinh.Heatly_Store.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.hieuvolaptrinh.Heatly_Store.Model.Type;

public interface TypeRepository extends JpaRepository<Type, Integer> {
    List<Type> findAllByTypeIdIn(List<Integer> typeIds);

    List<Type> findByTypeName(String typeName);

    @Query("SELECT t.typeId, COUNT(p) FROM Type t LEFT JOIN t.listProducts p GROUP BY t.typeId")
    List<Object[]> countProductsGroupedByType();

    @Query("SELECT COUNT(p) FROM Type t JOIN t.listProducts p WHERE t.typeId = :typeId")
    long countProductsByTypeId(@Param("typeId") int typeId);
}

