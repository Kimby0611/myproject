package com.example.ERPBack.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class ScheduleResponseDTO {
    private Long id;
    private String userId;
    private String title;
    private String content;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ScheduleResponseDTO(Long id, String userId, String title, String content, LocalDate date,
                               LocalTime startTime, LocalTime endTime, boolean completed,
                               LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.completed = completed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}