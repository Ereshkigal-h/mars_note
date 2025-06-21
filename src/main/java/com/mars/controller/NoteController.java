package com.mars.controller;

import com.mars.pojo.CreateNoteRequest; // 导入新类
import com.mars.pojo.Note;
import com.mars.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping
    public Note saveNote(@RequestBody CreateNoteRequest request) { // 修改方法参数
        try {
            return noteService.saveNote(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save note", e);
        }
    }
}