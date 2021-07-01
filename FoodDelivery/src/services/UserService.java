package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Customer;
import beans.Deliverer;
import beans.Manager;
import beans.User;
import dao.AdminDAO;
import dao.CustomerDAO;
import dao.DelivererDAO;
import dao.ManagerDAO;
import dao.UserDAO;
import dto.LoginDTO;




@Path("/user")
public class UserService {

	@Context
	ServletContext ctx;
	
	public UserService() {}
	
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
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User registerCustomer(User customer) {
		UserDAO dao = (UserDAO) ctx.getAttribute("users");
		try {
			if (dao.addUser(customer)) {
				ctx.setAttribute("users", dao);
				return customer;}
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
}
