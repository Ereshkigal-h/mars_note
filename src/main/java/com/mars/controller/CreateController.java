package com.mars.controller;

import com.mars.mapper.LoginMapper;
import com.mars.pojo.Result;
import com.mars.pojo.User;
import com.mars.service.CreateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/*
测试AI 和 User的创建*****************
 */
@Slf4j   //日志log
@RequestMapping("/creates")
@RestController  // 自动返回json格式数据
public class CreateController {
    @Autowired
    private CreateService createService;

    @Autowired
    private LoginMapper loginMapper;

    @PostMapping
    public Result UserCreate(@RequestBody User user) {
        log.info("创建一个新的User");
        if (loginMapper.existsByUsername(user.getUserName())){
            log.info("用户名已存在");
            return Result.error("用户名已存在");
        }
        createService.createUser(user);
        log.info("注册成功");
        return Result.success("注册成功");
    }
}
