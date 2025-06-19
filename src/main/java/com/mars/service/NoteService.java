package com.mars.service;

import com.mars.pojo.Note;
import com.mars.pojo.User;

public interface NoteService {


    /**
     *保存笔记
     * @return 笔记（含ID和时间戳）
    */
    Note saveNote(Note note,User user);


    //请继续完成功能
}