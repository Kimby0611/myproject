package com.example.ERPBack.service;


import com.example.ERPBack.entity.FreeBoard_table;
import com.example.ERPBack.entity.Notice_table;
import com.example.ERPBack.repository.FreeBoardRepository;
import com.example.ERPBack.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FreeBoardService {
    @Autowired
    private FreeBoardRepository freeBoardRepository;

    public FreeBoard_table saveFreeBoard(FreeBoard_table freeBoard_table) {
        return freeBoardRepository.save(freeBoard_table);
    }

    public Optional<FreeBoard_table> getFreeBoardByNum(Integer num) {
        System.out.println("getFreeBoardByNum 호출: num=" + num);
        Optional<FreeBoard_table> freeboard = freeBoardRepository.findByNum(num);
        if(freeboard.isPresent()) {
            FreeBoard_table freeboardTable = freeboard.get();
            freeboardTable.setIndex(freeboardTable.getIndex()+1);
            freeBoardRepository.save(freeboardTable);
            System.out.println("조회수 증가: num=" + num + ", index=" + freeboardTable.getIndex());
        }
        return freeboard; }

    @Transactional
    public FreeBoard_table updateFreeBoard(Integer num, FreeBoard_table freeBoard_table) {
        Optional<FreeBoard_table> existingFreeboard = freeBoardRepository.findByNum(num);
        if(existingFreeboard.isPresent()) {
            FreeBoard_table updatedFreeBoard = existingFreeboard.get();
            updatedFreeBoard.setTitle(freeBoard_table.getTitle());
            updatedFreeBoard.setContent(freeBoard_table.getContent());
            return freeBoardRepository.save(updatedFreeBoard);
        } else {
            throw new RuntimeException(num + "의 게시글을 찾을 수 없습니다.");
        }
        }
        @Transactional
    public void deleteFreeBoard(Integer num) {
        Optional<FreeBoard_table> existingFreeboard = freeBoardRepository.findByNum(num);
        if(existingFreeboard.isPresent()) {
            freeBoardRepository.deleteById(num);
        } else {
            throw new RuntimeException(num + "의 게시글을 찾을 수 없습니다.");
        }
        }
    public List<FreeBoard_table> searchFreeBoard(String option, String query) {
        if (query == null || query.trim().isEmpty()) {
            return freeBoardRepository.findAllByOrderByNumDesc();
        }
        return freeBoardRepository.searchByOption(option, query);
    }
}
