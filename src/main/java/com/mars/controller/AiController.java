package com.mars.controller;

import com.mars.pojo.AI;
import com.mars.pojo.User;
import com.mars.service.impl.AiServicelmpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@Slf4j   //日志log
@RequestMapping("/Ai")
@RestController  // 自动返回json格式数据
public class AiController {
    @Autowired
    private AiServicelmpl aiService;

    @PostMapping
    public ResponseEntity<Object> AiMessage(@RequestBody User user, String message, AI ai, String temperature){
        log.info("读取ai消息,user{}",user.getUserId());
        try {
            String ResultMassage = aiService.GetAiMessage(user, message, ai, temperature);
            return new ResponseEntity<>(ResultMassage, HttpStatus.OK);
        }
        catch (Exception e){
            log.error("ai读取失败");
            return  new ResponseEntity<>("读取失败",HttpStatus.INTERNAL_SERVER_ERROR);

        }























    }
}
