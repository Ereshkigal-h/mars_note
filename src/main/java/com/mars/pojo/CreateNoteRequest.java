package com.mars.pojo;

import lombok.Data;

@Data

public class CreateNoteRequest {

    private String content;
    private String userName;
}