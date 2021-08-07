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
import beans.Order;
import beans.User;
import beans.UserStatus;
import dto.CustomerPointsDTO;
import dto.LoginDTO;
import dto.ProfileDTO;
import dto.UserStatusDTO;

public class CustomerDAO {

	private final String path = "json/customers.json";

	private ArrayList<Customer> customers = new ArrayList<Customer>();

	public CustomerDAO() {
		try {
			deserialize();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public ArrayList<Customer> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Customer.class);
		customers = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return customers;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), customers);
	}

	public boolean addCustomer(User customer) throws JsonGenerationException, JsonMappingException, IOException {
		if (new UserDAO().alreadyRegistered(customer.getUsername()))
			return false;
		customers.add(new Customer(customer.getUsername(), customer.getPassword(), customer.getName(),
				customer.getSurname(), customer.getGender(), customer.getDateOfBirth(), customer.getRole(),
				UserStatus.REGULAR, new ArrayList<Order>(), null, 0, new CustomerType("Bronze", 0, 3000)));
		serialize();
		return true;
	}

	public Customer findUser(LoginDTO dto) {
		for (Customer c : customers) {
			if (c.getUsername().equals(dto.username) && c.getPassword().equals(dto.password))
				return c;
		}
		return null;
	}

	public Customer getUserById(String id) {
		for (Customer c : customers) {
			if (c.getUsername().equals(id))
				return c;
		}
		return null;
	}

	public boolean editProfile(ProfileDTO profile) throws JsonGenerationException, JsonMappingException, IOException {
		Customer customer = getUserById(profile.oldUsername);
		if (customer == null || !customer.getPassword().equals(profile.oldPassword))
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

	public boolean updatePoints(CustomerPointsDTO pointsDto)
			throws JsonGenerationException, JsonMappingException, IOException {
		if (getUserById(pointsDto.customerUsername) == null)
			return false;
		if (pointsDto.points < 0)
			pointsDto.points = 0;
		getUserById(pointsDto.customerUsername).setPoints(pointsDto.points);
		getUserById(pointsDto.customerUsername).getType().determineType(pointsDto.points);
		serialize();
		return true;
	}

	public void removeCustomer(User user) throws JsonGenerationException, JsonMappingException, IOException {
		customers.remove(getUserById(user.getUsername()));
		serialize();
	}

	public void setStatus(UserStatusDTO statusDto) throws JsonGenerationException, JsonMappingException, IOException {
		for (Customer c : customers) {
			if (c.getUsername().equals(statusDto.username)) {
				c.setStatus(statusDto.status);
				break;
			}
		}
		serialize();
	}
}
