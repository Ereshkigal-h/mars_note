package com.mars.service.impl;

import com.mars.mapper.NoteMapper;
import com.mars.pojo.Note;
import com.mars.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {
    @Autowired
    private NoteMapper noteMapper;

    @Override
    public Note createNote(Note note){
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        noteMapper.insertNoteId(note);

        String basePath = System.getProperty("user.dir");
        String subFolderPath = basePath + File.separator + "notes";

        // 确保子文件夹存在
        ensureFolderExists(subFolderPath);

        // 保存笔记到文件
        String fileName = "note_" + note.getNoteId() + ".txt";
        try (FileWriter writer = new FileWriter(subFolderPath + File.separator + fileName)) {
            writer.write(note.getContent());
        } catch (IOException e) {
            throw new RuntimeException("笔记保存失败", e);
        }

        note.setNoteAddress("./notes/" + fileName);
        noteMapper.insertNoteAds(note.getNoteId(),note.getNoteAddress());//Long 和String 的问题
        return note;
    }

    @Override
    public Note updateNote(Note note) {
        note.setUpdatedAt(LocalDateTime.now());

        String baseDir = System.getProperty("user.dir");
        String fileName = "note_" + note.getNoteId() + ".txt";
        Path filePath = Paths.get(baseDir, "notes", fileName); // [2](@ref)

        try {
            // 3. 检查文件是否存在
            if (!Files.exists(filePath)) {
                // 文件丢失时创建新文件（或根据业务需求抛异常）
                Files.createDirectories(filePath.getParent());
                Files.createFile(filePath);
            }

            // 4. 覆盖写入新内容（UTF-8编码）
            Files.writeString(filePath, note.getContent()); // Java 11+ [2](@ref)

        } catch (IOException e) {
            // 5. 异常处理（抛出自定义异常）
            String errorMsg = "笔记文件更新失败: " + e.getMessage();
        }

        return note;
    }

    public static void ensureFolderExists(String folderPath) {
        File folder = new File(folderPath);
        // 判断文件夹是否存在
        if (!folder.exists()) {
            // 创建文件夹（包括所有不存在的父目录）
            boolean success = folder.mkdirs();
            if (success) {
                System.out.println("文件夹创建成功: " + folderPath);
            } else {
                System.err.println("文件夹创建失败: " + folderPath);
            }
        } else {
            System.out.println("文件夹已存在: " + folderPath);
        }
    }
}
