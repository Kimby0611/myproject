package com.example.ERPBack.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "Notice_table")
@Getter
@Setter
public class Notice_table {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer num;

    @Column(name = "`index`")
    private Integer index;

    @Column(name = "`title`")
    private String title;

    @Column(name = "`writer`")
    private String writer;

    @Column(name = "`date`")
    private LocalDate date;

    @Column(name = "`content`", length = 1000)
    private String content;
}
