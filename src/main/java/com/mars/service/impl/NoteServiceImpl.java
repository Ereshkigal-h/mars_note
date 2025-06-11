package com.mars.service.impl;

import com.mars.pojo.Note;
import com.mars.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    @Override
    public Note createNote(Note note){
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        //noteMapper.insert(note); 等待数据库插入
        return note;
    }
}
