package jp.ycf.common.text;

import java.text.Normalizer;

public final class YcfStringNormalizer {
  private YcfStringNormalizer() {}
  public static String trimAndNormalize(String s) {
    if (s == null) return null;
    String v = Normalizer.normalize(s.replace('　', ' '), Normalizer.Form.NFKC).trim();
    return v.replaceAll("\\s+", " ");
  }
}
