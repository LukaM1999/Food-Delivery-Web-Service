package services;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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

import beans.Customer;
import beans.CustomerType;
import beans.Deliverer;
import beans.Manager;
import beans.User;
import dao.AdminDAO;
import dao.CustomerDAO;
import dao.DelivererDAO;
import dao.ManagerDAO;
import dao.UserDAO;
import dto.CustomerPointsDTO;
import dto.LoginDTO;
import dto.ProfileDTO;
import dto.UserStatusDTO;

@Path("/user")
public class UserService {

	@Context
	ServletContext ctx;

	public UserService() {
	}

	@PostConstruct
	public void init() throws IOException {
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
				return dao.getUserById(customer.getUsername());
			}
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
				return dao.getUserById(deliverer.getUsername());
			}
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
				ctx.setAttribute("users", userDao);
				return dao.getUserById(manager.getUsername());
			}
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
		return dao.findByUsername(id);
	}

	@PUT
	@Path("/editProfile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User editProfile(ProfileDTO profileDTO) throws JsonGenerationException, JsonMappingException, IOException {
		User editedProfile = null;
		switch (profileDTO.role) {
		case CUSTOMER: {
			CustomerDAO customerDao = (CustomerDAO) ctx.getAttribute("customers");
			if (!customerDao.editProfile(profileDTO))
				break;
			ctx.setAttribute("customers", customerDao);
			editedProfile = customerDao.getUserById(profileDTO.username);
			break;
		}
		case ADMIN:
			AdminDAO adminDao = (AdminDAO) ctx.getAttribute("admins");
			if (!adminDao.editProfile(profileDTO))
				break;
			ctx.setAttribute("admins", adminDao);
			editedProfile = adminDao.getUserById(profileDTO.username);
			break;
		case DELIVERER:
			DelivererDAO delivererDao = (DelivererDAO) ctx.getAttribute("deliverers");
			if (!delivererDao.editProfile(profileDTO))
				break;
			ctx.setAttribute("deliverers", delivererDao);
			editedProfile = delivererDao.getUserById(profileDTO.username);
			break;
		case MANAGER:
			ManagerDAO managerDao = (ManagerDAO) ctx.getAttribute("managers");
			if (!managerDao.editProfile(profileDTO))
				break;
			ctx.setAttribute("managers", managerDao);
			editedProfile = managerDao.getUserById(profileDTO.username);
		default:
			break;
		}
		if (editedProfile == null)
			return null;
		UserDAO userDao = (UserDAO) ctx.getAttribute("users");
		if (!userDao.editProfile(profileDTO)) return null;
		ctx.setAttribute("users", userDao);
		return editedProfile;
	}
	
	@PUT
	@Path("/updatePoints")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public CustomerType updatePoints(CustomerPointsDTO pointsDto) throws IOException {
		CustomerDAO customerDao = (CustomerDAO) ctx.getAttribute("customers");
		UserDAO userDao = (UserDAO) ctx.getAttribute("users");
		if (!customerDao.updatePoints(pointsDto)) return null;
		ctx.setAttribute("customers", customerDao);
		userDao.deserialize();
		ctx.setAttribute("users", userDao);
		return customerDao.getUserById(pointsDto.customerUsername).getType();
	}
	
	@DELETE
	@Path("/removeUser")
	@Consumes(MediaType.APPLICATION_JSON)
	public void removeUser(User user) throws IOException {
		switch (user.getRole()) {
		case CUSTOMER:
			CustomerDAO customerDao = (CustomerDAO) ctx.getAttribute("customers");
			customerDao.removeCustomer(user);
			ctx.setAttribute("customers", customerDao);
			break;
		case DELIVERER:
			DelivererDAO delivererDao = (DelivererDAO) ctx.getAttribute("deliverers");
			delivererDao.removeDeliverer(user);
			ctx.setAttribute("deliverers", delivererDao);
			break;
		case MANAGER:
			ManagerDAO managerDao = (ManagerDAO) ctx.getAttribute("managers");
			managerDao.removeManager(user);
			ctx.setAttribute("managers", managerDao);
		default:
			break;
		}
		UserDAO userDao = (UserDAO) ctx.getAttribute("users");
		userDao.deserialize();
		ctx.setAttribute("users", userDao);
	}
	
	@PUT
	@Path("/setStatus")
	@Consumes(MediaType.APPLICATION_JSON)
	public void setStatus(UserStatusDTO statusDto) throws IOException {
		switch (statusDto.role) {
		case CUSTOMER:
			CustomerDAO customerDao = (CustomerDAO) ctx.getAttribute("customers");
			customerDao.setStatus(statusDto);
			ctx.setAttribute("customers", customerDao);
			break;
		case DELIVERER:
			DelivererDAO delivererDao = (DelivererDAO) ctx.getAttribute("deliverers");
			delivererDao.setStatus(statusDto);
			ctx.setAttribute("deliverers", delivererDao);
			break;
		case MANAGER:
			ManagerDAO managerDao = (ManagerDAO) ctx.getAttribute("managers");
			managerDao.setStatus(statusDto);
			ctx.setAttribute("managers", managerDao);
		default:
			break;
		}
		UserDAO userDao = (UserDAO) ctx.getAttribute("users");
		userDao.deserialize();
		ctx.setAttribute("users", userDao);
	}
	
	
}
