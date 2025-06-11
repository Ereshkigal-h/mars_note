package com.mars.service.impl;

import com.mars.mapper.UserMapper;
import com.mars.pojo.User;
import com.mars.service.CreateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateServiceImpl implements CreateService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public void createUser(User user){userMapper.insertUser(user);}
}
