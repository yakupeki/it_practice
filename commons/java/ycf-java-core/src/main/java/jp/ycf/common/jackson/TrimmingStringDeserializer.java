package jp.ycf.common.jackson;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import jp.ycf.common.text.YcfStringNormalizer;

import java.io.IOException;

public class TrimmingStringDeserializer extends StdScalarDeserializer<String> {

  public TrimmingStringDeserializer() {
    super(String.class);
  }

  @Override
  public String deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException {
    return YcfStringNormalizer.trimAndNormalize(parser.getValueAsString());
  }
}
