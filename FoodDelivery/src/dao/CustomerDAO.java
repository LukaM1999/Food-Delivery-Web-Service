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
import dto.LoginDTO;

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
		System.out.println(new File(".").getCanonicalPath());
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Customer.class);
		customers = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return customers;
	}
	
	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), customers);
	}
	
	public boolean alreadyRegistered(Customer customer) {
		for (Customer c: customers) {
			if (c.getUsername().equals(customer.getUsername())) return true;
		}
		return false;
	}
	
	public boolean addCustomer(Customer customer) throws JsonGenerationException, JsonMappingException, IOException {
		if (alreadyRegistered(customer)) return false;
		customers.add(customer);
		serialize();
		return true;
	}
	
	public Customer findUser(LoginDTO dto) {
		for(Customer c: customers) {
			if (c.getUsername().equals(dto.username) && c.getPassword().equals(dto.password))
				return c;
		}
		return null;
	}
	
	public Customer getUserById(String id) {
		for(Customer c: customers) {
			if(c.getUsername().equals(id)) return c;
		}
		return null;
	}
}
