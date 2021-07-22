package services;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.Article;
import beans.Customer;
import beans.Deliverer;
import beans.Manager;
import beans.User;
import dao.AdminDAO;
import dao.CustomerDAO;
import dao.DelivererDAO;
import dao.ManagerDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.ArticleDTO;
import dto.LoginDTO;
import dto.ProfileDTO;




@Path("/user")
public class UserService {

	@Context
	ServletContext ctx;
	
	public UserService() {}
	
	@PostConstruct
	public void init() throws IOException {
		System.out.println(new File(".").getCanonicalPath());
		if (ctx.getAttribute("users") == null) {
			ctx.setAttribute("users", new UserDAO());
		}
		if (ctx.getAttribute("customers") == null) {
			ctx.setAttribute("customers", new CustomerDAO());
		}
		if (ctx.getAttribute("deliverers") == null) {
			ctx.setAttribute("deliverers", new DelivererDAO());
		}
		if (ctx.getAttribute("managers") == null) {
			ctx.setAttribute("managers", new ManagerDAO());
		}
		if (ctx.getAttribute("admins") == null) {
			ctx.setAttribute("admins", new AdminDAO());
		}
	}
	
	@GET
	@Path("/getAllCustomers")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Customer> getAllCustomers() throws IOException {
		CustomerDAO dao = (CustomerDAO) ctx.getAttribute("customers");
		return dao.deserialize();
	}
	
	@GET
	@Path("/getAllDeliverers")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Deliverer> getAllDeliverers() throws IOException {
		DelivererDAO dao = (DelivererDAO) ctx.getAttribute("deliverers");
		return dao.deserialize();
	}
	
	@GET
	@Path("/getAllManagers")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Manager> getAllManagers() throws IOException {
		ManagerDAO dao = (ManagerDAO) ctx.getAttribute("managers");
		return dao.deserialize();
	}
	
	@GET
	@Path("/getAllAdmins")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<User> getAllAdmins() throws IOException {
		AdminDAO dao = (AdminDAO) ctx.getAttribute("admins");
		return dao.deserialize();
	}
	
	@POST
	@Path("/find")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User find(LoginDTO dto) throws IOException {
		UserDAO dao = (UserDAO) ctx.getAttribute("users");
		return dao.findUser(dto);
	}
	
	@POST
	@Path("/registerCustomer")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Customer registerCustomer(Customer customer) {
		CustomerDAO dao = (CustomerDAO) ctx.getAttribute("customers");
		try {
			if (dao.addCustomer(customer)) {
				ctx.setAttribute("customers", dao);
				UserDAO userDao = (UserDAO) ctx.getAttribute("users");
				userDao.addUser(customer);
				return dao.getUserById(customer.getUsername());}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@POST
	@Path("/registerDeliverer")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Deliverer registerDeliverer(Deliverer deliverer) {
		DelivererDAO dao = (DelivererDAO) ctx.getAttribute("deliverers");
		try {
			if (dao.addDeliverer(deliverer)) {
				ctx.setAttribute("deliverers", dao);
				UserDAO userDao = (UserDAO) ctx.getAttribute("users");
				userDao.addUser(deliverer);
				return dao.getUserById(deliverer.getUsername());}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@POST
	@Path("/registerManager")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Manager registerManager(Manager manager) {
		ManagerDAO dao = (ManagerDAO) ctx.getAttribute("managers");
		try {
			if (dao.addManager(manager)) {
				ctx.setAttribute("managers", dao);
				UserDAO userDao = (UserDAO) ctx.getAttribute("users");
				userDao.addUser(manager);
				return dao.getUserById(manager.getUsername());}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	
	@GET
	@Path("/getUser/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public User getUser(@PathParam(value = "id") String id) {
		UserDAO dao = (UserDAO) ctx.getAttribute("users");
		return dao.getUserById(id);
	}
	
	@PUT
	@Path("/editProfile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User editProfile(ProfileDTO profileDTO) throws JsonGenerationException, JsonMappingException, IOException {
		UserDAO dao = (UserDAO) ctx.getAttribute("users");
		
		//nisam sredio povratnu vrednost
		if (dao.editProfile(profileDTO)) return new User();
		ctx.setAttribute("users", dao);
		return null;
	}
}
