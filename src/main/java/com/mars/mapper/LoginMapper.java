package com.mars.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LoginMapper {
    @Select("SELECT EXISTS(SELECT 1 FROM users WHERE user_name = #{userName})")
    Boolean existsByUsername(String userName);

    @Select("SELECT EXISTS(SELECT 1 FROM users WHERE user_name = #{userName} AND passwd_hash = #{passwdHash})")
    Boolean passWordToUsername(String userName, String passwdHash);
}