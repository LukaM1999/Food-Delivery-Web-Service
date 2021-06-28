package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.User;
import dao.UserDAO;




@Path("/food")
public class FoodDeliveryService {

	@Context
	ServletContext ctx;
	
	public FoodDeliveryService() {}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("users") == null) {
			ctx.setAttribute("users", new UserDAO());
		}
	}
	
	@GET
	@Path("/Users")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<User> dobaviOglase() throws IOException {
		UserDAO dao = (UserDAO) ctx.getAttribute("users");
		return dao.deserialize();
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
}
