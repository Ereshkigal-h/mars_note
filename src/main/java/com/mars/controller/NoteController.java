package com.mars.controller;

import com.mars.pojo.Note;
import com.mars.pojo.User;
import com.mars.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    @Autowired
    private final NoteService noteService;

    /**
     * 保存笔记
     */
    @PostMapping("/update")
    public ResponseEntity<Note> saveAndUpdateNote(@RequestBody @Valid Note note) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User user)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Note updatedNote = noteService.saveNote(note, user);
        return new ResponseEntity<>(updatedNote, HttpStatus.OK);
    }
}
