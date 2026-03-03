package com.example.sampleapp.config;

import com.fasterxml.jackson.databind.Module;
import jp.ycf.common.jackson.YcfJacksonModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

  @Bean
  public Module ycfJacksonModule() {
    return new YcfJacksonModule();
  }
}
