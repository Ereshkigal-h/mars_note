package com.mars.controller;

import com.mars.pojo.Note;
import com.mars.pojo.User;
import com.mars.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class NoteController {

    @Autowired
    private final NoteService noteService;

    /**
     * 保存笔记
     */
    @PostMapping("/update")
    public ResponseEntity<Note> saveAndUpdateNote(@RequestBody @Valid Note note ,@RequestBody User user) {
        Note updatedNote = noteService.saveNote(note,user);
        return new ResponseEntity<>(updatedNote, HttpStatus.OK);
    }
}
