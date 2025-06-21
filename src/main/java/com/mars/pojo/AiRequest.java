package com.mars.pojo;


import lombok.Data;

@Data
public class AiRequest {
    private long userId;
    private String username;
    private String message;

    // getters and setters
}
