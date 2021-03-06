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

import beans.Customer;
import beans.Manager;
import beans.Restaurant;
import beans.User;
import beans.UserStatus;
import dto.LoginDTO;
import dto.ProfileDTO;
import dto.UserStatusDTO;
import services.UserService;

public class ManagerDAO {

	private final String path = "json/managers.json";

	private ArrayList<Manager> managers = new ArrayList<Manager>();

	public ManagerDAO() {
		try {
			deserialize();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public ArrayList<Manager> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Manager.class);
		managers = new ObjectMapper().readValue(new String(Files.readAllBytes
				(Paths.get((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path))), typeReference);
		return managers;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path), managers);
	}

	public boolean addManager(User manager) throws JsonGenerationException, JsonMappingException, IOException {
		if (new UserDAO().alreadyRegistered(manager.getUsername()))
			return false;
		managers.add(new Manager(manager.getUsername(), manager.getPassword(), manager.getName(), manager.getSurname(),
				manager.getGender(), manager.getDateOfBirth(), manager.getRole(), UserStatus.REGULAR, null));
		serialize();
		return true;
	}

	public Manager findUser(LoginDTO dto) {
		for (Manager c : managers) {
			if (c.getUsername().equals(dto.username) && c.getPassword().equals(dto.password))
				return c;
		}
		return null;
	}

	public Manager getUserById(String id) {
		for (Manager c : managers) {
			if (c.getUsername().equals(id))
				return c;
		}
		return null;
	}

	public boolean assignRestaurant(Restaurant r, Manager m)
			throws JsonGenerationException, JsonMappingException, IOException {
		for (Manager c : managers) {
			if (c.getUsername().equals(m.getUsername())) {
				c.setRestaurant(r);
				serialize();
				return true;
			}
		}
		return false;
	}

	public boolean editProfile(ProfileDTO profile) throws JsonGenerationException, JsonMappingException, IOException {
		Manager manager = getUserById(profile.oldUsername);
		if (manager == null || !manager.getPassword().equals(profile.oldPassword))
			return false;
		if (profile.password != "")
			getUserById(profile.oldUsername).setPassword(profile.password);
		getUserById(profile.oldUsername).setName(profile.name);
		getUserById(profile.oldUsername).setSurname(profile.surname);
		getUserById(profile.oldUsername).setGender(profile.gender);
		getUserById(profile.oldUsername).setUsername(profile.username);
		serialize();
		return true;
	}

	public void removeManager(User user) throws JsonGenerationException, JsonMappingException, IOException {
		managers.remove(getUserById(user.getUsername()));
		serialize();
	}

	public void removeRestaurant(String name) throws JsonGenerationException, JsonMappingException, IOException {
		for (Manager m : managers) {
			if (m.getRestaurant() != null) {
				if (m.getRestaurant().getName().equals(name)) {
					m.setRestaurant(null);
					break;
				}
			}
		}
		serialize();
	}
	
	public void setStatus(UserStatusDTO statusDto) throws JsonGenerationException, JsonMappingException, IOException {
		for (Manager m : managers) {
			if (m.getUsername().equals(statusDto.username)) {
				m.setStatus(statusDto.status);
				break;
			}
		}
		serialize();
	}

}
