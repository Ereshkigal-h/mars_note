package com.mars.service;

import com.mars.pojo.AI;

public interface AiService {
 String GetAiMessage(long userId,String message, AI ai) throws Exception;
}
