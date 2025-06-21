package com.mars.service;

import com.mars.pojo.AI;
import com.mars.pojo.User;

public interface AiService {
 String GetAiMessage(User user, String message, AI ai) throws Exception;
}
