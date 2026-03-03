package jp.ycf.common.jackson;

import com.fasterxml.jackson.databind.module.SimpleModule;

public class YcfJacksonModule extends SimpleModule {

  public YcfJacksonModule() {
    super("YcfJacksonModule");
    addDeserializer(String.class, new TrimmingStringDeserializer());
  }
}
