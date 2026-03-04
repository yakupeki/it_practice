package com.example.sampleapp.config;

import jp.ycf.common.web.TrimParamFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebFilterConfig {

  @Bean
  public FilterRegistrationBean<TrimParamFilter> trimParamFilterRegistration() {
    FilterRegistrationBean<TrimParamFilter> registration = new FilterRegistrationBean<>();
    registration.setFilter(new TrimParamFilter());
    registration.addUrlPatterns("/*");
    registration.setOrder(1);
    return registration;
  }
}
