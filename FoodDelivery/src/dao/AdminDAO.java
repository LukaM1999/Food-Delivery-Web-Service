package dao;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.User;

public class AdminDAO {
	
	private final String path = "json/admins.json";

	private ArrayList<User> admins = new ArrayList<User>();
	
	public AdminDAO() {
		try {
			deserialize();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public ArrayList<User> deserialize() throws IOException {
		System.out.println(new File(".").getCanonicalPath());
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				User.class);
		admins = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return admins;
	}
	
	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), admins);
	}
}
