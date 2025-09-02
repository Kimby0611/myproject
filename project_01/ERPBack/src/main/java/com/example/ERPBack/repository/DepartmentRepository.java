package com.example.ERPBack.repository;


import com.example.ERPBack.entity.Department_table;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department_table, String> {
}
