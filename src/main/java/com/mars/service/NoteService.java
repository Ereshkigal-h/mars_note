package com.mars.service;

import com.mars.pojo.Note;

public interface NoteService {

    /**
     * 创建新笔记
     * @param note 笔记对象（需包含标题、内容）
     * @return 创建后的笔记（含ID和时间戳）
     */
    Note createNote(Note note);


    //请继续完成功能
}