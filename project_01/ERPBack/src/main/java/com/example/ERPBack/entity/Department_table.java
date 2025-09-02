package com.example.ERPBack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "department_table")
@Getter
@Setter
public class Department_table {

    @Id
    @Column(length = 5, nullable = false)
    private String department_code;

    @Column(length = 50, nullable = false)
    private String department_name;

}
