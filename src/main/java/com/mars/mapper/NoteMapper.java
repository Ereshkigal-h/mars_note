package com.mars.mapper;

import java.util.ArrayList;
import com.mars.pojo.Note;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import java.util.ArrayList;
import java.util.List;

@Mapper
public interface NoteMapper {
//  输入用户id返回一个NoteId的字符串，不同id使用逗号分割
    void selectNoteId(Note note);
    void selectNoteAddress(Note note);
    void insertNoteId(Note note);
    void updateNoteId(Note note);
    void insertNoteAds(Note note);
    void updateNoteAds(Note note);

}

