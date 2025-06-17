package com.mars.service.impl;

import com.mars.mapper.NoteMapper;
import com.mars.pojo.Note;
import com.mars.pojo.User;
import com.mars.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {
    private final NoteMapper noteMapper;

    @Override
    @Transactional
    public Note createNote(Note note, User user) {
        // 1. 初始化笔记属性
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        note.setUserId(user.getUserId());

        // 2. 首次插入数据库获取noteId（此时noteAddress为空）
        noteMapper.insertNoteAddress(note); // 执行后note.getNoteId()将被填充

        // 3. 构建文件路径
        String fileName = "note_" + note.getNoteId() + ".txt";
        String relativePath = "./notes/" + fileName; // 存储相对路径
        Path filePath = Paths.get("notes", fileName); // 实际文件路径

        try {
            // 4. 确保目录存在
            Files.createDirectories(filePath.getParent());
            // 5. 创建文件并写入内容
            Files.writeString(filePath, note.getContent());

            // 6. 更新数据库中的文件路径
            note.setNoteAddress(relativePath);
            noteMapper.updateNoteAds(note); // 更新note_id表
        } catch (IOException e) {
            throw new TransactionSystemException("文件创建失败: " + e.getMessage());
        }

        // 7. 关联用户和笔记
        noteMapper.insertCombineIdNoteUser(note);
        return note;
    }

    @Override
    @Transactional
    public Note updateNote(Note note, User user) {
        // 1. 更新数据库记录
        note.setUpdatedAt(LocalDateTime.now());
        noteMapper.updateNoteAds(note); // 更新note_id表的地址（如果地址变化）

        // 2. 获取实际文件路径（根据noteId构造）
        Path filePath = Paths.get("notes", "note_" + note.getNoteId() + ".txt");

        try {
            // 3. 覆盖写入内容
            Files.writeString(filePath, note.getContent());
        } catch (IOException e) {
            throw new TransactionSystemException("文件更新失败: " + e.getMessage());
        }
        return note;
    }
}