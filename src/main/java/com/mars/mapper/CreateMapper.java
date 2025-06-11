package com.mars.mapper;

import com.mars.pojo.User;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface CreateMapper {
    void createUser(User user);
}
