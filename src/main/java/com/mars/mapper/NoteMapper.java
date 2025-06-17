package com.mars.mapper;

import com.mars.pojo.Note;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoteMapper {
//  查询对应的地址
    void selectNoteAddress(Note note);
//  需要输入NoteId和noteAddress,适用于第一次创建
    void insertNoteAddress(Note note);
//  和上一个方法必须同时执行并且在同一个事务中，创建关联表辅助user查询对应的noteid
    void insertCombineIdNoteUser(Note note);
//  更新noteId对应的地址
    void updateNoteAds(Note note);
}

