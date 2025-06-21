package com.mars.service;

import com.mars.pojo.Note;
import com.mars.pojo.CreateNoteRequest; // 导入新类

public interface NoteService {

    /**
     * 保存笔记
     * @return 笔记（含ID和时间戳）
    */
    Note saveNote(CreateNoteRequest request); // 修改方法参数

    // 请继续完成功能
}