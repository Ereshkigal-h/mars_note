package com.mars.mapper;


import com.mars.pojo.Note;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NoteMap {
    @Insert("INSERT INTO notes(title, content, createdAt, updatedAt ,user_id) " +
            "VALUES(#{title}, #{content}, #{createdAt},#{updateAt}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Note note);

    @Select("SELECT * FROM notes WHERE id = #{id}")
    Note findById(long id);

    @Select("SELECT * FROM notes WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<Note> findByUserId(long userId);
}
