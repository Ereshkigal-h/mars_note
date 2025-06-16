package com.mars.mapper;

import com.mars.pojo.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    void insertUser(User user);
    void update(User user);
    User selectUserId(long id);
    User selectUserName(String name);
    String selectPasswd(long id);

}
