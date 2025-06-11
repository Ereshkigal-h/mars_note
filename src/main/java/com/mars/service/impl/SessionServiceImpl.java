package com.mars.service.impl;

import com.mars.mapper.SessionMapper;
import com.mars.pojo.Session;
import com.mars.pojo.User;
import com.mars.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessionServiceImpl implements SessionService {
    @Autowired
    SessionMapper sessionMapper;
    @Override
    public long getSessionId(Session session) {
        return sessionMapper.getSessionId();
    }
    public void setSessionUser(User user){
        sessionMapper.setSessionUser(user);
    }
}
