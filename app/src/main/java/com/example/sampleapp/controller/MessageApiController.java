package com.example.sampleapp.controller;

import com.example.sampleapp.dto.MessageRequest;
import com.example.sampleapp.dto.MessageResponse;
import com.example.sampleapp.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageApiController {

  private final MessageService service;

  public MessageApiController(MessageService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MessageResponse create(@Valid @RequestBody MessageRequest request) {
    return service.create(request);
  }

  @GetMapping
  public List<MessageResponse> list() {
    return service.list();
  }
}
