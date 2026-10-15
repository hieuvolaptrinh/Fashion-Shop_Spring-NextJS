
package com.hieuvolaptrinh.Heatly_Store.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hieuvolaptrinh.Heatly_Store.Model.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(String roleName);

    // Role findByRoleName(String roleName);

}
