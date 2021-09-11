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
import dto.ProfileDTO;
import services.UserService;

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
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				User.class);
		admins = new ObjectMapper().readValue(new String(Files.readAllBytes
				(Paths.get((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path))), typeReference);
		return admins;
	}
	
	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path), admins);
	}
	
	public User getUserById(String id) {
		for(User u: admins) {
			if(u.getUsername().equals(id)) return u;
		}
		return null;
	}
	
	public boolean editProfile(ProfileDTO profile) throws JsonGenerationException, JsonMappingException, IOException {
		User user = getUserById(profile.oldUsername);
		if (user == null || !user.getPassword().equals(profile.oldPassword)) return false;
		if (new UserDAO().alreadyRegistered(profile.username)) return false;
		if (profile.password != "") getUserById(profile.oldUsername).setPassword(profile.password);
		getUserById(profile.oldUsername).setName(profile.name);
		getUserById(profile.oldUsername).setSurname(profile.surname);
		getUserById(profile.oldUsername).setGender(profile.gender);
		getUserById(profile.oldUsername).setUsername(profile.username);
		serialize();
		return true;
	}
}
