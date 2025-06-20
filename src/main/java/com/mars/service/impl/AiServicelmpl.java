package com.mars.service.impl;

import com.mars.pojo.User;
import com.mars.pojo.AI;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
@Service
public class AiServicelmpl implements AiService {
    @Override
    public String GetAiMessage(User user, String message, AI ai, String temperature) throws Exception {
        long userId = user.userId;
        String url = ai.getUrl();
        JSONObject jsonObject = new JSONObject();
        jsonObject.set("user", userId);
        jsonObject.set("model", "x1");
        JSONArray messagesArray = new JSONArray();
        // 创建单个消息的JSON对象
        JSONObject messageObject = new JSONObject();

        messageObject.set("role", user.getUserName());
        messageObject.set("content", message);
        messageObject.set("temperature", temperature);

        messagesArray.put(messageObject);
        jsonObject.set("messages", messagesArray);
        jsonObject.set("stream", true);
        jsonObject.set("max_tokens", 4096);
        String header = "Authorization: Bearer" + ai.getAPISecret();
        URL obj;
        try {
            obj = new URL(url);
        } catch (MalformedURLException e) {
            throw new MalformedURLException("url不合法");
        }
        HttpURLConnection con;
        try {
            con = (HttpURLConnection) obj.openConnection();
        } catch (IOException e) {
            throw new Exception("连接错误");
        }
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Authorization", header);
        con.setDoOutput(true);

        OutputStream os = con.getOutputStream();
        os.write(jsonObject.toString().getBytes());
        os.flush();
        os.close();

        int responseCode = con.getResponseCode();
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();


        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
            System.out.println(inputLine);
        }
        in.close();
        String jsonStr = response.substring(0);
        if (!jsonStr.isEmpty()) {
            return jsonStr;

        }
        else {
            return "";
        }
    }

}
