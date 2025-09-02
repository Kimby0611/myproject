package com.example.ERPBack.controller;

import com.example.ERPBack.entity.Notice_table;
import com.example.ERPBack.entity.User_table;
import com.example.ERPBack.repository.NoticeRepository;
import com.example.ERPBack.service.NoticeService;
import org.aspectj.weaver.ast.Not;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notice")
@CrossOrigin(origins = "http://localhost:3000")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private NoticeRepository noticeRepository;

    @PostMapping
    public ResponseEntity<Notice_table> registerNotice(@RequestBody Notice_table notice_table) {
        Notice_table savedNotice = noticeService.saveNotice(notice_table);
        return ResponseEntity.ok(savedNotice);
    }

    @GetMapping
    public List<Notice_table> getAllNotices() {
        return noticeRepository.findAllByOrderByNumDesc();
    }

    @GetMapping("/{num}")
    public ResponseEntity<Notice_table> getNoticeByNum(@PathVariable Integer num) {
        Optional<Notice_table> notice = noticeService.getNoticeByNum(num);

        return notice.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{num}")
    public ResponseEntity<Notice_table> updateNotice(@PathVariable Integer num, @RequestBody Notice_table notice_table) {
        try {
            Notice_table updatedNotice = noticeService.updateNotice(num, notice_table);
            return ResponseEntity.ok(updatedNotice);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{num}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Integer num) {
        try {
            noticeService.deleteNotice(num);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public List<Notice_table> searchNotices(@RequestParam String option, @RequestParam String query) {
        return noticeService.searchNotices(option, query);
    }
}
