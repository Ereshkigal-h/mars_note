package com.mars.controller;


import com.mars.mapper.LoginMapper;
import com.mars.pojo.Result;
import com.mars.pojo.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j   //日志log
@RequestMapping("/login")
@RestController  // 自动返回json格式数据
public class LoginController {

    @Autowired
    private LoginMapper loginMapper;

    @PostMapping
    public Result login(@RequestBody User user){
        log.info("尝试登录");
        if (!loginMapper.existsByUsername(user.getUserName()) || !loginMapper.passWordToUsername(user.getUserName(),user.getPasswordHash())){
            log.info("登录失败");
            return Result.error("用户名或密码错误");
        }
        log.info("登录成功");
        return Result.success("登录成功");
    }
}
