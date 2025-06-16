package com.mars.mapper;

import com.mars.pojo.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
//  在数据库中第一次创建user
    void insertUser(User user);
//  更新数据库user数据
    void update(User user);
//  使用id来在数据库里面查询一个对象,最后封装成一个对象返回
    User selectUserById(long userId);
//  使用name来查询对象,封装成一个对象返回
    User selectUserByName(String name);
//  查询使用账户名查询密码，返回加密的密码字符串
    String selectPasswd(String name);
}
