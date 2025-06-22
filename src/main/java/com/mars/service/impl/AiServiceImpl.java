package com.mars.service.impl;

import com.mars.pojo.AI;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.mars.service.AiService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class AiServiceImpl implements AiService {
    @Override
    public String GetAiMessage(long userId, String message, AI ai) throws Exception {
        // 构建请求体
        JSONObject jsonObject = new JSONObject();
        jsonObject.set("model", "x1"); // 模型名称
        jsonObject.set("user", String.valueOf(userId)); // 用户ID

        // 构建 messages 数组
        JSONArray messagesArray = new JSONArray();
        JSONObject messageObject = new JSONObject();
        messageObject.set("role", "user"); // 固定值 "user"
        messageObject.set("content", message); // 用户输入的内容
        messagesArray.put(messageObject);
        jsonObject.set("messages", messagesArray);

        // 可选参数 stream，默认为 true
        jsonObject.set("stream", true);

        // 新增 tools 字段
        JSONArray toolsArray = new JSONArray();
        JSONObject toolObject = new JSONObject();
        toolObject.set("type", "web_search");

        JSONObject webSearchConfig = new JSONObject();
        webSearchConfig.set("enable", true); // 启用 web_search
        webSearchConfig.set("search_mode", "normal"); // 搜索模式为 normal
        toolObject.set("web_search", webSearchConfig);

        toolsArray.put(toolObject);
        jsonObject.set("tools", toolsArray);

        // 请求头设置
        String url = ai.getUrl();
        String header = "Bearer " + ai.getApiPasswd(); // 授权头
        URL obj;
        try {
            obj = new URL(url);
        } catch (MalformedURLException e) {
            throw new MalformedURLException("Invalid URL: " + url);
        }

        HttpURLConnection con;
        try {
            con = (HttpURLConnection) obj.openConnection();
        } catch (IOException e) {
            throw new Exception("Failed to open connection: " + e.getMessage(), e);
        }

        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Authorization", header);
        con.setDoOutput(true);

        // 发送请求体
        OutputStream os = con.getOutputStream();
        os.write(jsonObject.toString().getBytes());
        os.flush();
        os.close();

        // 获取响应
        int responseCode;
        try {
            responseCode = con.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                throw new IOException("Unexpected response code: " + responseCode);
            }
        } catch (IOException e) {
            throw new Exception("Error during API request: " + e.getMessage(), e);
        }

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder responseContent = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
            if (inputLine.startsWith("data: ")) {
                String jsonStr = inputLine.substring(6); // 去掉前面的"data: "
                try {
                    JSONObject data = JSONUtil.parseObj(jsonStr);
                    if (data.containsKey("choices")) {
                        JSONArray choices = data.getJSONArray("choices");
                        if (choices.size() > 0) {
                            JSONObject choice = choices.getJSONObject(0);
                            if (choice.containsKey("delta")) {
                                JSONObject delta = choice.getJSONObject("delta");
                                if (delta.containsKey("reasoning_content")) {
                                    String content = delta.getStr("reasoning_content");
                                    if (content != null && !content.isEmpty()) {
                                        responseContent.append(content);
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    // 忽略JSON解析错误，继续处理下一行
                }
            }
        }
        in.close();

        return responseContent.toString();
    }
}