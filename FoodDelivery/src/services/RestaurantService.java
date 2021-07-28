package services;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
import beans.Location;
import beans.Restaurant;
import dao.ManagerDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.ArticleDTO;
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
		if (ctx.getAttribute("logo") == null) {
			ctx.setAttribute("logo", "");
		}
		if (ctx.getAttribute("location") == null) {
			ctx.setAttribute("location", new Location());
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
				UserDAO userDao = (UserDAO) ctx.getAttribute("users");
				userDao.deserialize();
				ctx.setAttribute("users", userDao);
				return dao1.getRestaurantById(dto.restaurant.getName());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@GET
	@Path("/getLogo")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public String getLogo() throws UnsupportedEncodingException {
		return URLEncoder.encode((String) ctx.getAttribute("logo"), StandardCharsets.UTF_8.name());
	}
	
	@POST
	@Path("/setLogo")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String setLogo(String logo) throws UnsupportedEncodingException {
		ctx.setAttribute("logo", URLDecoder.decode(logo, StandardCharsets.UTF_8.name()));
		return logo;
	}
	
	@GET
	@Path("/getLocation")
	@Produces(MediaType.APPLICATION_JSON)
	public Location getLocation() {
		System.out.println(((Location) ctx.getAttribute("location")).getAddress());
		return (Location) ctx.getAttribute("location");
	}
	
	@POST
	@Path("/setLocation")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Location setLocation(Location location) {
		ctx.setAttribute("location", location);
		return location;
	}
	
	@GET
	@Path("/getRestaurant/{name}")
	@Produces(MediaType.APPLICATION_JSON)
	public Restaurant getRestaurant(@PathParam(value = "name") String name) {
		RestaurantDAO dao = (RestaurantDAO) ctx.getAttribute("restaurants");
		return dao.getRestaurantById(name);
	}
	
	@GET
	@Path("/{name}/getArticles")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Article> getArticles(@PathParam(value = "name") String name) {
		RestaurantDAO dao = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant restaurant = dao.getRestaurantById(name);
		return restaurant.getArticles();
	}
	
	@POST
	@Path("/addArticle")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Article addArticle(Article article) throws JsonGenerationException, JsonMappingException, IOException {
		RestaurantDAO dao = (RestaurantDAO) ctx.getAttribute("restaurants");
		if (dao.addArticle(article)) return article;
		ctx.setAttribute("restaurants", dao);
		return null;
	}
	
	@PUT
	@Path("/editArticle")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Article editArticle(ArticleDTO articleDto) throws JsonGenerationException, JsonMappingException, IOException {
		RestaurantDAO dao = (RestaurantDAO) ctx.getAttribute("restaurants");
		if (dao.editArticle(articleDto)) return articleDto.article;
		ctx.setAttribute("restaurants", dao);
		return null;
	}
	
	
	
}
