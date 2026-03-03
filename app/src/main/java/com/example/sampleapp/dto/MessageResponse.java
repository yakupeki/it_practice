package com.example.sampleapp.dto;

import java.time.LocalDateTime;

public record MessageResponse(Long id, String content, LocalDateTime createdAt) {
}
