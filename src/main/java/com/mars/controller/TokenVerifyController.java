package com.mars.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import com.mars.pojo.JwtProperties;

@RestController
@RequestMapping("/verify")
@Slf4j
public class TokenVerifyController {



    @PostMapping("/token")
    public Map<String, Object> verifyToken(@RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("正在解析 Token: " + token); // 调试用
            Jws<Claims> jws = Jwts.parserBuilder()
                    .setSigningKey(JwtProperties.SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);

            Claims claims = jws.getBody();
            String username = claims.getSubject();

            response.put("valid", true);
            response.put("username", username);
        } catch (Exception e) {
            log.warn("无效 Token: {}", e.getMessage());
            response.put("valid", false);
            response.put("error", "无效 Token");
        }
        return response;
    }
}
