package dao;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Customer;
import beans.Deliverer;
import beans.Manager;
import beans.User;
import dto.LoginDTO;

public class UserDAO {

	private final String path = "json/users.json";

	private ArrayList<User> users = new ArrayList<User>();
	private ArrayList<Customer> customers = new ArrayList<Customer>();
	private ArrayList<Deliverer> deliverers = new ArrayList<Deliverer>();
	private ArrayList<Manager> managers = new ArrayList<Manager>();
	private ArrayList<User> admins = new ArrayList<User>();
	
	
	public UserDAO() throws IOException {
		users.addAll(new CustomerDAO().deserialize());
		users.addAll(new DelivererDAO().deserialize());
		users.addAll(new ManagerDAO().deserialize());
		users.addAll(new AdminDAO().deserialize());
		populateLists();
		serialize();
	}
	
	public void populateLists() throws IOException {
		customers = new CustomerDAO().deserialize();
		deliverers = new DelivererDAO().deserialize();
		managers = new ManagerDAO().deserialize();
		admins = new AdminDAO().deserialize();
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
		deserialize();
		return true;
	}
	
	public User findUser(LoginDTO dto) {
		for(User u: users) {
			if (u.getUsername().equals(dto.username) && u.getPassword().equals(dto.password))
				return u;
		}
		return null;
	}
	
	public User getUserById(String id) {
		for(User u: users) {
			if(u.getUsername().equals(id)) return u;
		}
		return null;
	}
}
