package com.example.ERPBack.repository;

import com.example.ERPBack.entity.TodoSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TodoScheduleRepository extends JpaRepository<TodoSchedule, Long> {

    List<TodoSchedule> findByUserIdAndDate(String userId, LocalDate date);
    @Query("SELECT DISTINCT t.date FROM TodoSchedule t WHERE t.userId = :userId")
    List<LocalDate> findDistinctDatesByUserId(String userId);

}
