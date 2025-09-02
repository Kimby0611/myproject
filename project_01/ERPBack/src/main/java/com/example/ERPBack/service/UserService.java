package com.example.ERPBack.service;


import com.example.ERPBack.entity.User_table;
import com.example.ERPBack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User_table saveUser(User_table user) {
        try {
            // user_id는 반드시 필요
            if (user.getUserid() == null) {
                throw new IllegalArgumentException("user_id는 필수 필드입니다.");
            }
            if (user.getUserpw() != null && !user.getUserpw().isEmpty()) {
                user.setUserpw(passwordEncoder.encode(user.getUserpw()));
            }
            // 기존 사용자 조회
            User_table existingUser = null;
            if (userRepository.existsById(user.getUserid())) {
                existingUser = userRepository.findById(user.getUserid()).orElseThrow();
                // user_pw가 없으면 기존 값 유지
                if (user.getUserpw() == null || user.getUserpw().isEmpty()) {
                    user.setUserpw(existingUser.getUserpw());
                }
                // rrn_back이 없으면 기존 값 유지
                if (user.getRrnback() == null || user.getRrnback().isEmpty()) {
                    user.setRrnback(existingUser.getRrnback());
                }
                // user_name이 없으면 기존 값 유지
                if (user.getUsername() == null || user.getUsername().isEmpty()) {
                    user.setUsername(existingUser.getUsername());
                }
                // rrn_front가 없으면 기존 값 유지
                if (user.getRrnfront() == null || user.getRrnfront().isEmpty()) {
                    user.setRrnfront(existingUser.getRrnfront());
                }
                // department_code가 없으면 기존 값 유지
                if (user.getDepartmentcode() == null || user.getDepartmentcode().isEmpty()) {
                    user.setDepartmentcode(existingUser.getDepartmentcode());
                }
                // department_name과 department_code 연관성 처리 (예시)
                if (user.getDepartmentname() != null && !user.getDepartmentname().equals(existingUser.getDepartmentname())) {
                    // 부서명 변경 시 department_code 업데이트 로직 (필요 시 구현)
                    // 예: user.setDepartment_code(fetchDepartmentCode(user.getDepartment_name()));
                }
            } else {
                // 신규 사용자일 경우 rrn_back 필수
                if (user.getRrnback() == null) {
                    throw new IllegalArgumentException("신규 사용자 등록 시 rrn_back은 필수 필드입니다.");
                }
            }
            // rrn_back 중복 체크
            if (existingUser == null || !existingUser.getRrnback().equals(user.getRrnback())) {
                if (userRepository.existsByRrnback(user.getRrnback())) {
                    throw new IllegalArgumentException("rrn_back이 이미 존재합니다.");
                }
            }
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("데이터베이스 제약 조건 위반: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("사용자 저장 중 오류 발생: " + e.getMessage());
        }
    }
}