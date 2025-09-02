package com.example.ERPBack.service;

import com.example.ERPBack.dto.ScheduleRequestDTO;
import com.example.ERPBack.dto.ScheduleResponseDTO;
import com.example.ERPBack.entity.TodoSchedule;
import com.example.ERPBack.repository.TodoScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final TodoScheduleRepository scheduleRepository;

    // 일정 등록
    public void createSchedule(ScheduleRequestDTO request) {
        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            throw new IllegalArgumentException("일정 제목은 필수입니다.");
        }
        if (request.getParsedStartTime() == null || request.getParsedEndTime() == null) {
            throw new IllegalArgumentException("시작 시간과 종료 시간은 필수입니다.");
        }
        if (request.getParsedDate() == null) {
            throw new IllegalArgumentException("날짜는 필수입니다.");
        }

        TodoSchedule schedule = TodoSchedule.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .content(request.getContent())
                .date(request.getParsedDate())
                .startTime(request.getParsedStartTime())
                .endTime(request.getParsedEndTime())
                .completed(request.isCompleted())
                .build();

        scheduleRepository.save(schedule);
    }

    // 특정 날짜의 일정 조회
    public List<ScheduleResponseDTO> getSchedulesByDate(String userId, LocalDate date) {
        List<TodoSchedule> schedules = scheduleRepository.findByUserIdAndDate(userId, date);
        return schedules.stream()
                .map(schedule -> new ScheduleResponseDTO(
                        schedule.getId(),
                        schedule.getUserId(),
                        schedule.getTitle(),
                        schedule.getContent(),
                        schedule.getDate(),
                        schedule.getStartTime(),
                        schedule.getEndTime(),
                        schedule.getCompleted(),
                        schedule.getCreatedAt(),
                        schedule.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }

    // 일정 수정
    public void updateSchedule(Long id, ScheduleRequestDTO request) {
        TodoSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다: " + id));

        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            throw new IllegalArgumentException("일정 제목은 필수입니다.");
        }
        if (request.getParsedStartTime() == null || request.getParsedEndTime() == null) {
            throw new IllegalArgumentException("시작 시간과 종료 시간은 필수입니다.");
        }
        if (request.getParsedDate() == null) {
            throw new IllegalArgumentException("날짜는 필수입니다.");
        }

        schedule.setTitle(request.getTitle());
        schedule.setContent(request.getContent());
        schedule.setDate(request.getParsedDate());
        schedule.setStartTime(request.getParsedStartTime());
        schedule.setEndTime(request.getParsedEndTime());
        schedule.setCompleted(request.isCompleted());

        scheduleRepository.save(schedule);
    }

    // 일정 삭제
    public void deleteSchedule(Long id) {
        TodoSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다: " + id));
        scheduleRepository.delete(schedule);
    }
    public List<String> getScheduleDates(String userId) {
        return scheduleRepository.findDistinctDatesByUserId(userId)
                .stream()
                .map(LocalDate::toString) // YYYY-MM-DD 형식
                .collect(Collectors.toList());
    }

}