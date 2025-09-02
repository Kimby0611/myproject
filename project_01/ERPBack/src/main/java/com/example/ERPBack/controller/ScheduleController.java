package com.example.ERPBack.controller;

import com.example.ERPBack.dto.ScheduleRequestDTO;
import com.example.ERPBack.dto.ScheduleResponseDTO;
import com.example.ERPBack.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // 일정 등록
    @PostMapping
    public ResponseEntity<String> createSchedule(@RequestBody ScheduleRequestDTO request) {
        try {
            scheduleService.createSchedule(request);
            return ResponseEntity.ok("일정이 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 특정 날짜 기준 일정 조회
    @GetMapping
    public ResponseEntity<List<ScheduleResponseDTO>> getSchedules(
            @RequestParam String userId,
            @RequestParam String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        List<ScheduleResponseDTO> schedules = scheduleService.getSchedulesByDate(userId, localDate);
        return ResponseEntity.ok(schedules);
    }

    // 일정 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateSchedule(
            @PathVariable Long id,
            @RequestBody ScheduleRequestDTO request
    ) {
        try {
            scheduleService.updateSchedule(id, request);
            return ResponseEntity.ok("일정이 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 일정 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Long id) {
        try {
            scheduleService.deleteSchedule(id);
            return ResponseEntity.ok("일정이 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/dates")
    public ResponseEntity<List<String>> getScheduleDates(@RequestParam String userId) {
        List<String> dates = scheduleService.getScheduleDates(userId);
        return ResponseEntity.ok(dates);
    }
}