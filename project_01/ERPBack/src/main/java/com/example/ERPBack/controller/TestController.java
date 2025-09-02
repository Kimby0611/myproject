package com.example.ERPBack.controller;

import com.example.ERPBack.entity.Department_table;
import com.example.ERPBack.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    @Autowired
    private DepartmentRepository departmentRepository;

//    @GetMapping("/test")
//    public List<Department_table> getAllDepartments() {
//        return departmentRepository.findAll();
//    }

    @GetMapping("/dept")
    public List<Department_table> getAllDepartments() {
        return departmentRepository.findAll();
    }

}
