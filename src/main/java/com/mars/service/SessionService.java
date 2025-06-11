package com.mars.service;

import com.mars.pojo.Session;
import com.mars.pojo.User;

public interface SessionService {
    long getSessionId(Session session);
    void setSessionUser(User user);
}
