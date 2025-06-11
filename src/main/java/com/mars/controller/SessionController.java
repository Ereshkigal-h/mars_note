package com.mars.controller;


import com.mars.pojo.Result;
import com.mars.pojo.Session;
import com.mars.pojo.User;
import com.mars.service.SessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
由于测试调用Session
 */
@Slf4j   //日志log
@RequestMapping("/sesstions")
@RestController  // 自动返回json格式数据
public class SessionController {
    @Autowired
    private SessionService sessionService;

    @GetMapping
    public Result sessionIdGet(Session session) {
        log.info("获取sessionId");
        sessionService.getSessionId(session);
        return Result.success(session);
    }
    @PostMapping
    public Result setSessionUser(User user) {
        log.info("在一个session中添加user");
        sessionService.setSessionUser(user);
        return Result.success();
    }
}
