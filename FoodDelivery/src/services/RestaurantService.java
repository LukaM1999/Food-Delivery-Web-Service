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

import beans.Restaurant;
import dao.RestaurantDAO;




@Path("/restaurant")
public class RestaurantService {

	@Context
	ServletContext ctx;
	
	public RestaurantService(){}
	
	@PostConstruct
	public void init() throws IOException {
		System.out.println(new File(".").getCanonicalPath());
		if (ctx.getAttribute("restaurants") == null) {
			ctx.setAttribute("restaurants", new RestaurantDAO());
		}
	}
	
	@GET
	@Path("/getAllRestaurants")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Restaurant> getAllRestaurants() throws IOException {
		RestaurantDAO dao = (RestaurantDAO) ctx.getAttribute("restaurants");
		return dao.deserialize();
	}
}
