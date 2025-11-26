package com.retry.retrybackend.controller.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private String roomId;
    private String content;
    private Long senderId;
    private String timestamp;
}

