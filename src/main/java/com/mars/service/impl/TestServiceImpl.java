package com.mars.service.impl;

import com.mars.mapper.TestMapper;
import com.mars.pojo.Test;
import com.mars.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service //  将当前类交给Spring管理，自动创建对象，并注入到其他地方
public class TestServiceImpl implements TestService {

    @Autowired
    private TestMapper testMapper;

    @Override
    public List<Test> findAll() {
        return testMapper.findAll();
    }

}
