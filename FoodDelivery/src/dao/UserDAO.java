package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.User;
import dto.LoginDTO;

public class UserDAO {

	private final String path = "json/users.json";

	private ArrayList<User> users = new ArrayList<User>();
	
	public UserDAO() {
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
		users = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return users;
	}
	
	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), users);
	}
	
	public boolean alreadyRegistered(User user) {
		for (User u: users) {
			if (u.getUsername().equals(user.getUsername())) return true;
		}
		return false;
	}
	
	public boolean addUser(User user) throws JsonGenerationException, JsonMappingException, IOException {
		if (alreadyRegistered(user)) return false;
		users.add(user);
		serialize();
		return true;
	}
	
	public User findUser(LoginDTO dto) {
		for(User u: users) {
			if (u.getUsername().equals(dto.username) && u.getPassword().equals(dto.password))
				return u;
		}
		return null;
	}
}
