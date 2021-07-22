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
import dto.ProfileDTO;

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
	
	public User findUser(String username, String password) {
		for(User u: users) {
			if (u.getUsername().equals(username) && u.getPassword().equals(password))
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
	
	public boolean editProfile(ProfileDTO dto) throws JsonGenerationException, JsonMappingException, IOException {
		User user = findUser(dto.oldUsername, dto.oldPassword);
		if (user == null) return false;
		
		int indexOfUser = users.indexOf(user);
		users.get(indexOfUser).setUsername(dto.username);
		users.get(indexOfUser).setPassword(dto.password);
		users.get(indexOfUser).setName(dto.name);
		users.get(indexOfUser).setSurname(dto.surname);
		users.get(indexOfUser).setGender(dto.gender);
		users.get(indexOfUser).setDateOfBirth(dto.dateOfBirth);
		
		updateRoleLists(dto, user);
		return true;
	}

	private void updateRoleLists(ProfileDTO dto, User user)
			throws JsonGenerationException, JsonMappingException, IOException {
		switch (user.getRole()) {	
		case ADMIN:
			int indexOfAdmin = admins.indexOf(user);
			
			admins.get(indexOfAdmin).setUsername(dto.username);
			admins.get(indexOfAdmin).setPassword(dto.password);
			admins.get(indexOfAdmin).setName(dto.name);
			admins.get(indexOfAdmin).setSurname(dto.surname);
			admins.get(indexOfAdmin).setGender(dto.gender);
			admins.get(indexOfAdmin).setDateOfBirth(dto.dateOfBirth);

			serialize();
			break;
			
		case CUSTOMER:
			int indexOfCustomer = customers.indexOf(user);
			
			customers.get(indexOfCustomer).setUsername(dto.username);
			customers.get(indexOfCustomer).setPassword(dto.password);
			customers.get(indexOfCustomer).setName(dto.name);
			customers.get(indexOfCustomer).setSurname(dto.surname);
			customers.get(indexOfCustomer).setGender(dto.gender);
			customers.get(indexOfCustomer).setDateOfBirth(dto.dateOfBirth);
			
			serialize();
			break;
			
			
		case DELIVERER:
			int indexOfDeliverer = deliverers.indexOf(user);
			
			deliverers.get(indexOfDeliverer).setUsername(dto.username);
			deliverers.get(indexOfDeliverer).setPassword(dto.password);
			deliverers.get(indexOfDeliverer).setName(dto.name);
			deliverers.get(indexOfDeliverer).setSurname(dto.surname);
			deliverers.get(indexOfDeliverer).setGender(dto.gender);
			deliverers.get(indexOfDeliverer).setDateOfBirth(dto.dateOfBirth);
			
			serialize();
			break;
			
		case MANAGER:
			int indexOfManager = managers.indexOf(user);
			
			managers.get(indexOfManager).setUsername(dto.username);
			managers.get(indexOfManager).setPassword(dto.password);
			managers.get(indexOfManager).setName(dto.name);
			managers.get(indexOfManager).setSurname(dto.surname);
			managers.get(indexOfManager).setGender(dto.gender);
			managers.get(indexOfManager).setDateOfBirth(dto.dateOfBirth);
			
			serialize();
			//mozda treba posebno napraviti funkcije za cuvanje u sve fajlove unutar ove klase
			break;
		
		default:
			break;
		}
	}
}
