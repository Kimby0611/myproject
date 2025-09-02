package com.example.ERPBack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_table")
@Getter
@Setter
public class User_table {
    @Id
    @Column(length = 100, nullable = false)
    private String userid;

    @Column(length = 64, nullable = false)
    private String userpw;

    @Column(length = 50, nullable = false)
    private String username;

    @Column(length = 10, nullable = false)
    private String rrnfront;

    @Column(length = 64, nullable = false, unique = true)
    private String rrnback;

    @Column(length = 100, nullable = true)
    private String email;

    @Column(length = 13, nullable = true)
    private String phone;

    @Column(length = 13, nullable = true)
    private String departmentcode;

    @Column(length = 13, nullable = true)
    private String departmentname;

    @Column(length = 10, nullable = true)
    private String rank;

    @Column(length = 20, nullable = true)
    private String role;
}
