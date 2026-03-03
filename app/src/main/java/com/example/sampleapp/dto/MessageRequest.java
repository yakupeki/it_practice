package com.example.sampleapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageRequest(
    @NotBlank(message = "メッセージは必須です")
    @Size(max = 100, message = "メッセージは100文字以内で入力してください")
    String content
) {
}
