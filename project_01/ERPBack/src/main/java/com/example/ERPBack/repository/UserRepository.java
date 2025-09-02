package com.example.ERPBack.repository;

import com.example.ERPBack.entity.User_table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User_table, String> {
    boolean existsByRrnback(String rrnBack);
}
