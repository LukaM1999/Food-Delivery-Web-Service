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
import dto.LoginDTO;




@Path("/user")
public class UserService {

	@Context
	ServletContext ctx;
	
	public UserService() {}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("users") == null) {
			ctx.setAttribute("users", new UserDAO());
		}
	}
	
	@GET
	@Path("/users")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<User> dobaviOglase() throws IOException {
		UserDAO dao = (UserDAO) ctx.getAttribute("users");
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
}
