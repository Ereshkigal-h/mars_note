package com.mars.controller;

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

    @PostMapping
    public Result UserCreate(@RequestBody User user) {
        log.info("创建一个新的User");
        createService.createUser(user);
        return Result.success();
    }
}
