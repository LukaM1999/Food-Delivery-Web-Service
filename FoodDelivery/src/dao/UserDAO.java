package dao;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.User;
import dto.LoginDTO;
import dto.ProfileDTO;
import services.UserService;

public class UserDAO {

	private final String path = "json/users.json";

	private ArrayList<User> users = new ArrayList<User>();
	
	public UserDAO() throws IOException {
		deserialize();
		serialize();
	}

	public ArrayList<User> deserialize() throws IOException {
		users.clear();
		users.addAll(new CustomerDAO().deserialize());
		users.addAll(new DelivererDAO().deserialize());
		users.addAll(new ManagerDAO().deserialize());
		users.addAll(new AdminDAO().deserialize());
		return users;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path), users);
	}

	public boolean alreadyRegistered(String username) {
		for (User u : users) {
			if (u.getUsername().equals(username))
				return true;
		}
		return false;
	}

	public boolean addUser(User user) throws JsonGenerationException, JsonMappingException, IOException {
		if (alreadyRegistered(user.getUsername()))
			return false;
		users.add(user);
		serialize();
		deserialize();
		return true;
	}

	public User findUser(LoginDTO dto) {
		for (User u : users) {
			if (u.getUsername().equals(dto.username) && u.getPassword().equals(dto.password))
				return u;
		}
		return null;
	}

	public User findByUsername(String username) {
		for (User u : users) {
			if (u.getUsername().equals(username))
				return u;
		}
		return null;
	}

	public boolean editProfile(ProfileDTO dto) throws JsonGenerationException, JsonMappingException, IOException {
		if (findByUsername(dto.oldUsername) == null)
			return false;
		findByUsername(dto.oldUsername).setPassword(dto.password);
		findByUsername(dto.oldUsername).setName(dto.name);
		findByUsername(dto.oldUsername).setSurname(dto.surname);
		findByUsername(dto.oldUsername).setGender(dto.gender);
		findByUsername(dto.oldUsername).setUsername(dto.username);
		serialize();
		deserialize();
		return true;
	}
}
