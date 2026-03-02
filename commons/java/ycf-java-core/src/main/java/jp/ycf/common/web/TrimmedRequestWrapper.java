package jp.ycf.common.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jp.ycf.common.text.YcfStringNormalizer;

public class TrimmedRequestWrapper extends HttpServletRequestWrapper {
  public TrimmedRequestWrapper(HttpServletRequest request) { super(request); }
  @Override
  public String getParameter(String name) { return YcfStringNormalizer.trimAndNormalize(super.getParameter(name)); }
}
