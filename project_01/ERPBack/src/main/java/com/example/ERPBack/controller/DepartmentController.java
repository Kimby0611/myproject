package com.example.ERPBack.controller;

import com.example.ERPBack.entity.Department_table;
import com.example.ERPBack.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping("/part")
    public List<Department_table> getAllDepartments() {
        return departmentRepository.findAll();
    }
}