package com.example.sampleapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MessageApiControllerTest {

  @Autowired
  MockMvc mockMvc;

  @Test
  void create_shouldNormalizeInput() throws Exception {
    mockMvc.perform(post("/api/messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"content":"  ＡＢＣ　　テスト  "}
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.content").value("ABC テスト"));
  }

  @Test
  void list_shouldReturnSavedMessages() throws Exception {
    mockMvc.perform(get("/api/messages"))
        .andExpect(status().isOk());
  }
}
