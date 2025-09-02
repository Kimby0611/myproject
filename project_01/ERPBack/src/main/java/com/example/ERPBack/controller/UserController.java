package com.example.ERPBack.controller;

import com.example.ERPBack.entity.User_table;
import com.example.ERPBack.repository.UserRepository;
import com.example.ERPBack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/user_table")
    public ResponseEntity<User_table> registerUser(@RequestBody User_table user_table) {
        User_table savedUser = userService.saveUser(user_table);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/user")
    public List<User_table> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<User_table> updateUser(@PathVariable String userId, @RequestBody User_table update_table) {
        if ((!userRepository.existsById(userId))) {
            return ResponseEntity.notFound().build();
        }
        update_table.setUserid(userId);
        User_table save_user = userService.saveUser(update_table);
        return ResponseEntity.ok(save_user);
    }

    @GetMapping("/user/{userId}/password")
    public ResponseEntity<String> getUserPassword(@PathVariable String userId) {
        User_table user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user.getUserpw()); // 암호화된 비밀번호 반환
    }

    @PostMapping("/user/{userId}/verify-password")
    public ResponseEntity<String> verifyPassword(@PathVariable String userId, @RequestBody String password) {
        User_table user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }
        if (passwordEncoder.matches(password, user.getUserpw())) {
            return ResponseEntity.ok("비밀번호가 일치합니다.");
        } else {
            return ResponseEntity.status(401).body("비밀번호가 틀렸습니다.");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User_table> getUserById(@PathVariable String userId) {
        User_table user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
