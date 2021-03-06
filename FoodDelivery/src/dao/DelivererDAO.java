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
import beans.Deliverer;
import beans.User;
import beans.UserStatus;
import dto.LoginDTO;
import dto.ProfileDTO;
import dto.UserStatusDTO;
import services.UserService;

public class DelivererDAO {

	private final String path = "json/deliverers.json";

	private ArrayList<Deliverer> deliverers = new ArrayList<Deliverer>();
	
	public DelivererDAO() {
		try {
			deserialize();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public ArrayList<Deliverer> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Deliverer.class);
		deliverers = new ObjectMapper().readValue(new String(Files.readAllBytes
				(Paths.get((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path))), typeReference);
		return deliverers;
	}
	
	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path), deliverers);
	}
	
	public boolean addDeliverer(User deliverer) throws JsonGenerationException, JsonMappingException, IOException {
		if (new UserDAO().alreadyRegistered(deliverer.getUsername())) return false;
		deliverers.add(new Deliverer(deliverer.getUsername(), deliverer.getPassword(), deliverer.getName(), 
				deliverer.getSurname(), deliverer.getGender(), deliverer.getDateOfBirth(), deliverer.getRole(), UserStatus.REGULAR));
		serialize();
		return true;
	}
	
	public Deliverer findUser(LoginDTO dto) {
		for(Deliverer c: deliverers) {
			if (c.getUsername().equals(dto.username) && c.getPassword().equals(dto.password))
				return c;
		}
		return null;
	}
	
	public Deliverer getUserById(String id) {
		for(Deliverer c: deliverers) {
			if(c.getUsername().equals(id)) return c;
		}
		return null;
	}
	
	public boolean editProfile(ProfileDTO profile) throws JsonGenerationException, JsonMappingException, IOException {
		Deliverer deliverer = getUserById(profile.oldUsername);
		if (deliverer == null || !deliverer.getPassword().equals(profile.oldPassword)) return false;
		if (profile.password != "") getUserById(profile.oldUsername).setPassword(profile.password);
		getUserById(profile.oldUsername).setName(profile.name);
		getUserById(profile.oldUsername).setSurname(profile.surname);
		getUserById(profile.oldUsername).setGender(profile.gender);
		getUserById(profile.oldUsername).setUsername(profile.username);
		serialize();
		return true;
	}
	
	public void removeDeliverer(User user) throws JsonGenerationException, JsonMappingException, IOException {
		deliverers.remove(getUserById(user.getUsername()));
		serialize();
	}
	
	public void setStatus(UserStatusDTO statusDto) throws JsonGenerationException, JsonMappingException, IOException {
		for (Deliverer d : deliverers) {
			if (d.getUsername().equals(statusDto.username)) {
				d.setStatus(statusDto.status);
				break;
			}
		}
		serialize();
	}
}
