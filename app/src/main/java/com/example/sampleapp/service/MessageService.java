package com.example.sampleapp.service;

import com.example.sampleapp.dto.MessageRequest;
import com.example.sampleapp.dto.MessageResponse;
import com.example.sampleapp.entity.Message;
import com.example.sampleapp.repository.MessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
  private static final Logger log = LoggerFactory.getLogger(MessageService.class);

  private final MessageRepository repository;

  public MessageService(MessageRepository repository) {
    this.repository = repository;
  }

  public MessageResponse create(MessageRequest request) {
    Message message = new Message();
    message.setContent(request.content());
    Message saved = repository.save(message);
    log.info("メッセージを保存しました: id={}", saved.getId());
    return toResponse(saved);
  }

  public List<MessageResponse> list() {
    return repository.findAll().stream().map(this::toResponse).toList();
  }

  private MessageResponse toResponse(Message m) {
    return new MessageResponse(m.getId(), m.getContent(), m.getCreatedAt());
  }
}
