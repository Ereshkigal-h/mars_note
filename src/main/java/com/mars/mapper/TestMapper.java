package com.mars.mapper;

import com.mars.pojo.Test;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper // 表示当前接口是一个MyBatis的Mapper代理接口
public interface TestMapper {
    @Select("select id, name, create_time, update_time  from dept order by update_time desc")
    List<Test> findAll();
}
