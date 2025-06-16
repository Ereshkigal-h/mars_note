package com.mars.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    public long userId;
    private String userName;
    private String passwordHash;
    private String availableAitype;

}
