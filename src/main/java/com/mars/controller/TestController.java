package com.mars.controller;

import com.mars.pojo.Result;
import com.mars.pojo.Test;
import com.mars.service.TestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j   //日志log
@RequestMapping("/depts")
@RestController  // 自动返回json格式数据
public class TestController {

//    private static final Logger log = LoggerFactory.getLogger(DeptController.class);

    @Autowired  // 自动注入
    private TestService  testService;


//    @RequestMapping(value = "/depts" , method = RequestMethod.GET)  // 接口，指定请求方式，已替换为@GetMapping

    @GetMapping
    public Result list() {
        log.info("查询全部部门数据");
        List<Test> TestList = testService.findAll();
        return Result.success(TestList);
    }
}