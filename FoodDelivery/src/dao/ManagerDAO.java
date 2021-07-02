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

import beans.Deliverer;
import beans.Manager;
import beans.User;
import dto.LoginDTO;

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
		managers = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return managers;
	}
	
	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), managers);
	}
	
	public boolean addManager(User manager) throws JsonGenerationException, JsonMappingException, IOException {
		if (new UserDAO().alreadyRegistered(manager)) return false;
		managers.add(new Manager(manager.getUsername(), manager.getPassword(), manager.getName(), 
				manager.getSurname(), manager.getGender(), manager.getDateOfBirth(), manager.getRole(), null));
		serialize();
		return true;
	}
	
	public Manager findUser(LoginDTO dto) {
		for(Manager c: managers) {
			if (c.getUsername().equals(dto.username) && c.getPassword().equals(dto.password))
				return c;
		}
		return null;
	}
	
	public Manager getUserById(String id) {
		for(Manager c: managers) {
			if(c.getUsername().equals(id)) return c;
		}
		return null;
	}
}
