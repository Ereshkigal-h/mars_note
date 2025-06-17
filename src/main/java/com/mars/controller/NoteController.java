package com.mars.controller;

import com.mars.pojo.Note;
import com.mars.pojo.User;
import com.mars.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    @Autowired
    private final NoteService noteService;

    @PostMapping //
    public ResponseEntity<Note> createNote(@RequestBody Note note , User  user) {
        Note createdNote = noteService.createNote(note,user);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);

    }

    public  ResponseEntity<Note> updateNote(Note note,User  user) {
        Note updatedNote = noteService.updateNote(note,user);
        return new ResponseEntity<>(updatedNote, HttpStatus.OK);
    }
}
