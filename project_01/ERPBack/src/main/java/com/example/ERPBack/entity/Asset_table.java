package com.example.ERPBack.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "asset_table")
@Getter
@Setter
public class Asset_table {
    @Id
    @Column(length = 5, nullable = false)
    private String asset_number;

    @Column(length = 100, nullable = false)
    private String asset_name;

    @Column(nullable = false)
    private Integer asset_price;

    @Column(length = 100, nullable = true)
    private String create_company;

    @Column(nullable = true)
    private LocalDate create_year;

    @Column(length = 100, nullable = true)
    private String charge_department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.사용;
}