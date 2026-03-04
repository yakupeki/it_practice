package jp.ycf.common.text;

import java.text.Normalizer;

public final class YcfStringNormalizer {

  private YcfStringNormalizer() {
  }

  public static String trimAndNormalize(String s) {
    if (s == null) {
      return null;
    }
    String normalized = Normalizer.normalize(s, Normalizer.Form.NFKC)
        .replace('\u3000', ' ')
        .trim();
    return normalized.replaceAll("\\s+", " ");
  }
}
