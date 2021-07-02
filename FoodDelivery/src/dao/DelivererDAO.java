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
import beans.CustomerType;
import beans.Deliverer;
import beans.Order;
import beans.User;
import dto.LoginDTO;

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
		deliverers = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return deliverers;
	}
	
	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), deliverers);
	}
	
	public boolean addDeliverer(User deliverer) throws JsonGenerationException, JsonMappingException, IOException {
		if (new UserDAO().alreadyRegistered(deliverer)) return false;
		deliverers.add(new Deliverer(deliverer.getUsername(), deliverer.getPassword(), deliverer.getName(), 
				deliverer.getSurname(), deliverer.getGender(), deliverer.getDateOfBirth(), deliverer.getRole()));
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
	
	
}
