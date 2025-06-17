package com.mars.controller;

import com.mars.mapper.LoginMapper;
import com.mars.pojo.Result;
import com.mars.pojo.User;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.SignatureAlgorithm;
import com.mars.pojo.JwtProperties;



@Slf4j
@RequestMapping("/login")
@RestController
public class LoginController {



    @Autowired
    private LoginMapper loginMapper;

    @PostMapping
    public Result login(@RequestBody User user) {
        log.info("尝试登录: {}", user.getUserName());

        if (!loginMapper.existsByUsername(user.getUserName()) ||
                !loginMapper.passWordToUsername(user.getUserName(), user.getPasswordHash())) {
            log.info("登录失败: {}", user.getUserName());
            return Result.error("用户名或密码错误");
        }

        log.info("登录成功: {}", user.getUserName());

        // 生成 JWT Token
        String token = Jwts.builder()
                .setSubject(user.getUserName())
                .signWith(SignatureAlgorithm.HS512, JwtProperties.SECRET_KEY) // 替换为安全密钥
                .compact();

        log.info("登录成功: {}", user.getUserName());

        return Result.success(token); // 返回 Token 给前端
    }
}