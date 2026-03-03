package jp.ycf.common.text;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class YcfStringNormalizerTest {

  @Test
  void trimAndNormalize_shouldNormalizeAndTrim() {
    String input = "  ＡＢＣ　　テスト   123  ";
    assertEquals("ABC テスト 123", YcfStringNormalizer.trimAndNormalize(input));
  }

  @Test
  void trimAndNormalize_shouldReturnNullForNullInput() {
    assertNull(YcfStringNormalizer.trimAndNormalize(null));
  }
}
