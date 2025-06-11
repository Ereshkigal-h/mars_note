package com.mars.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Session {
    private static long sessionId;
    private String sessionUserId;
    private String aiType;
}
