package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.websocket.server.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.Order;
import beans.OrderStatus;
import beans.Restaurant;
import dao.ManagerDAO;
import dao.OrderDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.OrderDTO;
import dto.RestaurantDTO;

@Path("/order")
public class OrderService {

	@Context
	ServletContext ctx;

	public OrderService() {
	}

	@PostConstruct
	public void init() throws IOException {
		// System.out.println(new File(".").getCanonicalPath());
		if (ctx.getAttribute("restaurants") == null) {
			ctx.setAttribute("restaurants", new RestaurantDAO());
		}
		if (ctx.getAttribute("orders") == null) {
			ctx.setAttribute("orders", new OrderDAO());
		}
	}

	@GET
	@Path("/getAllOrders")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Order> getAllOrders() throws IOException {
		OrderDAO orderDao = (OrderDAO) ctx.getAttribute("orders");
		return orderDao.getAllOrders();
	}
	
	@GET
	@Path("/getOrders/{restaurant}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Order> getOrders(@PathParam(value = "restaurant") String restaurantName) throws IOException {
		OrderDAO orderDao = (OrderDAO) ctx.getAttribute("orders");
		return orderDao.getOrdersByRestaurant(restaurantName);
	}

	@POST
	@Path("/addOrder")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Order addOrder(Order order) throws JsonGenerationException, JsonMappingException, IOException {
		OrderDAO orderDao = (OrderDAO) ctx.getAttribute("orders");
		if (!orderDao.addOrder(order)) return null;
		ctx.setAttribute("orders", orderDao);
		return order;
	}
	
	@POST
	@Path("/setStatus")
	@Consumes(MediaType.APPLICATION_JSON)
	public void setStatus(OrderDTO orderDto) throws JsonGenerationException, JsonMappingException, IOException {
		OrderDAO orderDao = (OrderDAO) ctx.getAttribute("orders");
		orderDao.setOrderStatus(orderDto);
		ctx.setAttribute("orders", orderDao);
	}
}
