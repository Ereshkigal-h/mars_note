package com.mars.exception;


import com.mars.pojo.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理
 */
@Slf4j
@RestControllerAdvice
public class GlobalExpectionHandler {

    @ExceptionHandler
    public Result handleException(Exception e){
        log.error("程序出错啦",e);
        return Result.error("出错啦");
    }

    @ExceptionHandler
    public Result handleDuplicateKeyExpection(DuplicateKeyException e){
        log.error("程序出错啦",e);
        String message = e.getMessage();
        int i = message.indexOf("Duplicate entry");
        String errMsg = message.substring(i);
        String[] arr = errMsg.split(" ");
        return Result.error(arr[2] + "已存在");

    }
}
