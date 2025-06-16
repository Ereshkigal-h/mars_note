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
//  输入用户id返回一个NoteId的字符串，不同id使用逗号分割,会直接返回到note对象里面
    void selectNoteId(Note note);
//  输入用户id返回一个NoteId的字符串，不同id使用逗号分割,返回一个字符串地址
    String selectNoteAddress(String NoteId);
//  第一次创建NoteId 会自动调用note对象
    void insertNoteId(Note note);
//  更新NoteId，会自动调用note对象
    void updateNoteId(Note note);
//  需要输入NoteId和noteAddress,适用于第一次创建
    void insertNoteAds(String NoteId,String noteAddress);
//  需要输入NoteId和noteAddress,适用于更新已有的值
    void updateNoteAds(String NoteId,String noteAddress);

}

