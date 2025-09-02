package com.example.ERPBack.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ScheduleRequestDTO {
    private String userId;
    private String title;
    private String content;
    private String date; // YYYY-MM-DD 문자열
    private String startTime; // HH:mm 문자열
    private String endTime; // HH:mm 문자열
    private boolean completed;

    // 백엔드에서 사용할 LocalDate/LocalTime 변환 메서드
    public LocalDate getParsedDate() {
        return date != null ? LocalDate.parse(date) : null;
    }

    public LocalTime getParsedStartTime() {
        return startTime != null ? LocalTime.parse(startTime) : null;
    }

    public LocalTime getParsedEndTime() {
        return endTime != null ? LocalTime.parse(endTime) : null;
    }
}