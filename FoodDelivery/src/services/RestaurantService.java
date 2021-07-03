package services;

import java.io.File;
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
import beans.Restaurant;
import dao.CustomerDAO;
import dao.ManagerDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.RestaurantDTO;

@Path("/restaurant")
public class RestaurantService {

	@Context
	ServletContext ctx;

	public RestaurantService() {
	}

	@PostConstruct
	public void init() throws IOException {
		System.out.println(new File(".").getCanonicalPath());
		if (ctx.getAttribute("restaurants") == null) {
			ctx.setAttribute("restaurants", new RestaurantDAO());
		}
		if (ctx.getAttribute("managers") == null) {
			ctx.setAttribute("managers", new ManagerDAO());
		}
	}

	@GET
	@Path("/getAllRestaurants")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Restaurant> getAllRestaurants() throws IOException {
		RestaurantDAO dao = (RestaurantDAO) ctx.getAttribute("restaurants");
		return dao.deserialize();
	}

	@POST
	@Path("/createRestaurant")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Restaurant createRestaurant(RestaurantDTO dto) {
		RestaurantDAO dao1 = (RestaurantDAO) ctx.getAttribute("restaurants");
		ManagerDAO dao2 = (ManagerDAO) ctx.getAttribute("managers");
		try {
			if (dao1.addRestaurant(dto.restaurant)) {
				ctx.setAttribute("restaurants", dao1);
				dao2.assignRestaurant(dto.restaurant, dto.manager);
				ctx.setAttribute("managers", dao2);
				return dao1.getRestaurantById(dto.restaurant.getName());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	
}
