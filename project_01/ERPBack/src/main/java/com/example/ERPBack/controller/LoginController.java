package com.example.ERPBack.controller;

import com.example.ERPBack.dto.LoginRequest;
import com.example.ERPBack.dto.LoginResponse;
import com.example.ERPBack.entity.User_table;
import com.example.ERPBack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User_table user = userRepository.findById(loginRequest.getUserid()).orElse(null);
        if (user == null || !passwordEncoder.matches(loginRequest.getUserpw(), user.getUserpw())) {
            return ResponseEntity.badRequest().body("아이디나 비밀번호가 일치하지 않습니다.");
        }
        return ResponseEntity.ok(new LoginResponse(user.getUserid(), user.getUsername(), user.getRole(), user.getRank()));
    }
}
