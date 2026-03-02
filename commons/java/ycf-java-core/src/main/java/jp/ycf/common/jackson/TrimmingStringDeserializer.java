package jp.ycf.common.jackson;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import java.io.IOException;
import jp.ycf.common.text.YcfStringNormalizer;

public class TrimmingStringDeserializer extends StdScalarDeserializer<String> {
  public TrimmingStringDeserializer() { super(String.class); }
  @Override
  public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    return YcfStringNormalizer.trimAndNormalize(p.getValueAsString());
  }
}
