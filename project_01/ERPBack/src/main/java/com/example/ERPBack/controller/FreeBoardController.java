package com.example.ERPBack.controller;

import com.example.ERPBack.entity.FreeBoard_table;
import com.example.ERPBack.entity.Notice_table;
import com.example.ERPBack.repository.FreeBoardRepository;
import com.example.ERPBack.service.FreeBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/freeboard")
@CrossOrigin(origins = "http://localhost:3000")
public class FreeBoardController {

    @Autowired
    private FreeBoardService freeBoardService;

    @Autowired
    private FreeBoardRepository freeBoardRepository;

    @PostMapping
    public ResponseEntity<FreeBoard_table> registerFreeBoard(@RequestBody FreeBoard_table freeBoard_table) {
        FreeBoard_table savedFreeBoard = freeBoardService.saveFreeBoard(freeBoard_table);
        return ResponseEntity.ok(savedFreeBoard);
    }

    @GetMapping
    public List<FreeBoard_table> getAllFreeBoards() {
        return freeBoardRepository.findAllByOrderByNumDesc();
    }

    @GetMapping("/{num}")
    public ResponseEntity<FreeBoard_table> getFreeBoardByNum(@PathVariable Integer num) {
        Optional<FreeBoard_table> freeboard = freeBoardService.getFreeBoardByNum(num);

        return freeboard.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{num}")
    public ResponseEntity<FreeBoard_table> updateFreeBoard(@PathVariable Integer num, @RequestBody FreeBoard_table freeBoard_table) {
        try {
            FreeBoard_table updatedFreeBoard = freeBoardService.updateFreeBoard(num, freeBoard_table);
            return ResponseEntity.ok(updatedFreeBoard);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{num}")
    public ResponseEntity<Void> deleteFreeBoard(@PathVariable Integer num) {
        try {
            freeBoardService.deleteFreeBoard(num);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public List<FreeBoard_table> searchFreeBoard(@RequestParam String option, @RequestParam String query) {
        return freeBoardService.searchFreeBoard(option, query);
    }
}
