package com.mars.service.impl;

import com.mars.mapper.NoteMapper;
import com.mars.pojo.Note;
import com.mars.pojo.User;
import com.mars.service.NoteService;
import com.mars.pojo.CreateNoteRequest; // 导入新类
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {
    @Autowired
    private  NoteMapper noteMapper;
    @Override
    @Transactional
    public Note saveNote(CreateNoteRequest request) { // 修改方法参数
        // 设置用户名与时间戳
        Note note = new Note();
        note.setUserName(request.getUserName());
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        note.setContent(request.getContent());
        note.setNoteAddress(".");

        try {
            // 首次插入数据库获取noteId（此时noteAddress设为当前目录）
//            noteMapper.insertNoteAddress(note); // 执行后note.getNoteId()将被填充
//            noteMapper.insertCombineIdNoteUser(note);

            String content = note.getContent(); // 获取Note的content字段
            // 生成唯一文件名：note_用户名_时间戳.txt
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = "note_" + request.getUserName() + "_" + timestamp + ".txt";
              String saveDir = "C:/Users/Administrator/Downloads/";// 默认存储目录

            // 确保目录存在
            java.nio.file.Path dirPath = java.nio.file.Paths.get(saveDir);
            if (!java.nio.file.Files.exists(dirPath)) {
                try {
                    java.nio.file.Files.createDirectories(dirPath);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to create directories", e);
                }
            }
            java.nio.file.Path filePath = java.nio.file.Paths.get(saveDir, fileName);

            // 将content写入文件
            try {
                Files.write(filePath, content.getBytes());
                System.out.println("文件已保存至: " + filePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save content to file", e);
            }

            note.setNoteAddress(filePath.toString());
//            noteMapper.updateNoteAds(note);
            return note;
        } catch (Exception e) {
            // 记录详细错误信息以便调试
            System.err.println("保存笔记过程中发生异常: " + e.getMessage());
            e.printStackTrace();
            throw e; // 重新抛出原始异常以保留堆栈跟踪
        }
    }
}