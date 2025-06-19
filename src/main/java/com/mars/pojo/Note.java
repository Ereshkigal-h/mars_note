package com.mars.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Note {
    private Long noteId;// 笔记ID（主键）
    private String content;      // 笔记内容
    private LocalDateTime createdAt; // 创建时间
    private LocalDateTime updatedAt; // 更新时间
    private Long userId;         // 关联的用户ID
    private String noteAddress;
}
