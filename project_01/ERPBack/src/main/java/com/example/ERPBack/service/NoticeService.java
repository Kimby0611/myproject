package com.example.ERPBack.service;


import com.example.ERPBack.entity.Notice_table;
import com.example.ERPBack.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeRepository;

    public Notice_table saveNotice(Notice_table notice_table) {
        return noticeRepository.save(notice_table);
    }

    public Optional<Notice_table> getNoticeByNum(Integer num) {
        System.out.println("getNoticeByNum 호출: num=" + num);
        Optional<Notice_table> notice = noticeRepository.findByNum(num);
        if(notice.isPresent()) {
            Notice_table noticeTable = notice.get();
            noticeTable.setIndex(noticeTable.getIndex()+1);
            noticeRepository.save(noticeTable);
            System.out.println("조회수 증가: num=" + num + ", index=" + noticeTable.getIndex());
        }
        return notice; }

    @Transactional
    public Notice_table updateNotice(Integer num, Notice_table notice_table) {
        Optional<Notice_table> existingNotice = noticeRepository.findByNum(num);
        if(existingNotice.isPresent()) {
            Notice_table updatedNotice = existingNotice.get();
            updatedNotice.setTitle(notice_table.getTitle());
            updatedNotice.setContent(notice_table.getContent());
            return noticeRepository.save(updatedNotice);
        } else {
            throw new RuntimeException(num + "의 게시글을 찾을 수 없습니다.");
        }
        }
        @Transactional
    public void deleteNotice(Integer num) {
        Optional<Notice_table> existingNotice = noticeRepository.findByNum(num);
        if(existingNotice.isPresent()) {
            noticeRepository.deleteById(num);
        } else {
            throw new RuntimeException(num + "의 게시글을 찾을 수 없습니다.");
        }
        }
    public List<Notice_table> searchNotices(String option, String query) {
        if (query == null || query.trim().isEmpty()) {
            return noticeRepository.findAllByOrderByNumDesc();
        }
        return noticeRepository.searchByOption(option, query);
    }
}
