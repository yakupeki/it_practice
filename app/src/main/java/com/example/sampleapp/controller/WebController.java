package com.example.sampleapp.controller;

import com.example.sampleapp.dto.MessageRequest;
import com.example.sampleapp.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class WebController {

  private final MessageService service;

  public WebController(MessageService service) {
    this.service = service;
  }

  @GetMapping("/")
  public String index(Model model) {
    model.addAttribute("form", new MessageRequest(""));
    model.addAttribute("messages", service.list());
    return "index";
  }

  @PostMapping("/messages")
  public String create(@Valid @ModelAttribute("form") MessageRequest request,
                       BindingResult bindingResult,
                       Model model) {
    if (bindingResult.hasErrors()) {
      model.addAttribute("messages", service.list());
      return "index";
    }
    service.create(request);
    return "redirect:/";
  }
}
