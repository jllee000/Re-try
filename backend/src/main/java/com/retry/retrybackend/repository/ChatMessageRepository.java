package com.retry.retrybackend.repository;

import com.retry.retrybackend.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findByRoomIdOrderByTimestampAsc(String roomId);
}
