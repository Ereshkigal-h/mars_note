package com.mars.pojo;


import lombok.Data;

@Data
public class AiRequest {
    private User user;
    private String message;
    private String temperature;

    // getters and setters
}
