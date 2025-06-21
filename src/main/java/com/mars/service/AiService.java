package com.mars.service;

import com.mars.pojo.AI;
import com.mars.pojo.User;

public interface AiService {
 String GetAiMessage(long userId,String message, AI ai) throws Exception;
}
