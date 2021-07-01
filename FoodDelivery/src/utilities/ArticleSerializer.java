package utilities;

import java.io.IOException;
import java.io.StringWriter;
import java.lang.reflect.Type;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdKeySerializer;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

@SuppressWarnings("serial")
public class ArticleSerializer extends StdSerializer<Object> {
	private static final StdSerializer<Object> DEFAULT = new StdKeySerializer();
    private static final ObjectMapper mapper = new ObjectMapper();

    protected ArticleSerializer() {
    super(Object.class);
    }

    @Override
    public JsonNode getSchema(SerializerProvider provider, Type typeHint) throws JsonMappingException {
    return DEFAULT.getSchema(provider, typeHint);
    }

    @Override
    public void serialize(Object value, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonGenerationException {
    if (null == value) {
        throw new JsonGenerationException("Could not serialize object to json, input object to serialize is null");
    }
    StringWriter writer = new StringWriter();
    mapper.writeValue(writer, value);
    jgen.writeFieldName(writer.toString());
    }
}
