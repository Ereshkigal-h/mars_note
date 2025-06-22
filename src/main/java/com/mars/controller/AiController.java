package com.mars.controller;

import com.mars.pojo.AI;
import com.mars.pojo.AiRequest;
import com.mars.pojo.Result;
import com.mars.pojo.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mars.service.AiService;

@Slf4j   //日志log
@RequestMapping("/Ai")
@RestController  // 自动返回json格式数据
public class AiController {
    @Autowired
    private AiService aiService;
    private AI ai=new AI();
    @PostMapping
    public ResponseEntity<Object> AiMessage(@RequestBody AiRequest request) {
        log.info("收到AI请求，用户ID: {}", 111111);
        try {
            String resultMessage = aiService.GetAiMessage(1111, request.getMessage(),
                    new AI());
            return ResponseEntity.status(HttpStatus.OK).body(resultMessage);

        } catch (Exception e) {
            log.error("AI请求失败", e);
            return new ResponseEntity<>("读取失败", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

