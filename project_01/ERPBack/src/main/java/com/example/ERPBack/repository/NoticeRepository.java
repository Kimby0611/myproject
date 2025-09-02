package com.example.ERPBack.repository;

import com.example.ERPBack.entity.Notice_table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice_table, Integer> {
    // 데이터를 내림차순으로 정렬하여 데이터 반환
    List<Notice_table> findAllByOrderByNumDesc();

    Optional<Notice_table> findByNum(Integer num);


    @Query("SELECT n FROM Notice_table n WHERE " +
            "(:option = 'title' AND LOWER(n.title) LIKE %:query%) OR " +
            "(:option = 'writer' AND n.writer LIKE %:query%) OR " +
            "(:option = 'content' AND LOWER(n.content) LIKE %:query%) " +
            "ORDER BY n.num DESC")
    List<Notice_table> searchByOption(@Param("option") String option, @Param("query") String query);
}
