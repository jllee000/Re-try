package com.retry.retrybackend.controller.chat;

import com.retry.retrybackend.controller.chat.dto.ChatMessage;
import com.retry.retrybackend.config.JwtUtil;
import com.retry.retrybackend.entity.ChatMessageEntity;
import com.retry.retrybackend.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatRepo;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message,
                            @Header("Authorization") String token) {

        Long senderId = JwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));

        ChatMessageEntity saved = chatRepo.save(
                new ChatMessageEntity(
                        message.getRoomId(),
                        senderId,
                        message.getContent(),
                        LocalDateTime.now()
                )

        );

        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), saved);
    }


    @GetMapping("/messages")   // ⭐ 실제 URI = /api/chat/messages
    public List<ChatMessageEntity> getMessages(@RequestParam String roomId) {
        return chatRepo.findByRoomIdOrderByTimestampAsc(roomId);
    }
}
