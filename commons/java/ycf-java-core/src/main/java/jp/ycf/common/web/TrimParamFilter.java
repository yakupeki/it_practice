package jp.ycf.common.web;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

public class TrimParamFilter implements Filter {
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    if (request instanceof HttpServletRequest req) chain.doFilter(new TrimmedRequestWrapper(req), response);
    else chain.doFilter(request, response);
  }
}
