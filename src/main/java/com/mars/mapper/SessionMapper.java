package com.mars.mapper;

import com.mars.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SessionMapper {
    @Select("")
    long getSessionId();
    void setSessionUser(User user);
}
