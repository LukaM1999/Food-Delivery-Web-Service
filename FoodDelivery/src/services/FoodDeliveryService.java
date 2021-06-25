package services;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
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
	
	
	
}
