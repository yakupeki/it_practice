package jp.ycf.common.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jp.ycf.common.text.YcfStringNormalizer;

import java.util.Map;
import java.util.stream.Collectors;

public class TrimmedRequestWrapper extends HttpServletRequestWrapper {

  public TrimmedRequestWrapper(HttpServletRequest request) {
    super(request);
  }

  @Override
  public String getParameter(String name) {
    return YcfStringNormalizer.trimAndNormalize(super.getParameter(name));
  }

  @Override
  public String[] getParameterValues(String name) {
    String[] values = super.getParameterValues(name);
    if (values == null) {
      return null;
    }
    String[] normalized = new String[values.length];
    for (int i = 0; i < values.length; i++) {
      normalized[i] = YcfStringNormalizer.trimAndNormalize(values[i]);
    }
    return normalized;
  }

  @Override
  public Map<String, String[]> getParameterMap() {
    return super.getParameterMap()
        .entrySet()
        .stream()
        .collect(Collectors.toMap(
            Map.Entry::getKey,
            e -> {
              String[] values = e.getValue();
              String[] normalized = new String[values.length];
              for (int i = 0; i < values.length; i++) {
                normalized[i] = YcfStringNormalizer.trimAndNormalize(values[i]);
              }
              return normalized;
            }
        ));
  }
}
