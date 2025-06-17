package com.mars.service;

import com.mars.pojo.Note;
import com.mars.pojo.User;

public interface NoteService {

    /**
     * 创建新笔记
     * @param note 笔记对象（需包含标题、内容）
     * @return 创建后的笔记（含ID和时间戳）
     */
    Note createNote(Note note,User user);
    /**
     *修改笔记
     * @return 修改后的笔记（含ID和时间戳）
    */
    Note updateNote(Note note,User user);

    //请继续完成功能
}