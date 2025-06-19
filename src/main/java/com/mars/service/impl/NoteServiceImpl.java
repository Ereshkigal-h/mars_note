package com.mars.service.impl;

import com.mars.mapper.NoteMapper;
import com.mars.pojo.Note;
import com.mars.pojo.User;
import com.mars.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {
    @Autowired
    private  NoteMapper noteMapper;
    @Override
    @Transactional
    public Note saveNote(Note note, User user) {Note newNote = new Note();
        newNote.setCreatedAt(LocalDateTime.now());
        newNote.setUpdatedAt(LocalDateTime.now());
        newNote.setUserId(user.getUserId());
        newNote.setContent(note.getContent());
        newNote.setNoteAddress(".");

        user.addNoteId(newNote.getNoteId());
        // 首次插入数据库获取noteId（此时noteAddress设为当前目录）
        noteMapper.insertNoteAddress(note); // 执行后note.getNoteId()将被填充
        noteMapper.insertCombineIdNoteUser(note);

        //构建文件路径
        String fileName = "note_" + note.getNoteId() + ".txt";
        String relativePath = "./notes/" + fileName; // 存储相对路径
        Path filePath = Paths.get("notes", fileName); // 实际文件路径

        note.setNoteAddress(filePath.toString());
        noteMapper.updateNoteAds(note);

        try {
            // 4. 确保目录存在
            Files.createDirectories(filePath.getParent());
            // 5. 创建文件并写入内容
            Files.writeString(filePath, note.getContent());

        } catch (IOException e) {
            throw new TransactionSystemException("文件创建失败: " + e.getMessage());
        }

        return note;
    }


}