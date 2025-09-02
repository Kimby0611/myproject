package com.example.ERPBack.repository;

import com.example.ERPBack.entity.Asset_table;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset_table, String> {
}
