package com.mars.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    public long userId;
    private String userName;
    private String passwordHash;
    private String availableAitype;
    private ArrayList<Long> noteId;

}
