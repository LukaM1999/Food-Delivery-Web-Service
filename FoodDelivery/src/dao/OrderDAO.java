package dao;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.Order;
import beans.OrderStatus;
import dto.DeliveryRequestDTO;
import dto.OrderDTO;

public class OrderDAO {
	private final String path = "json/orders.json";

	private ArrayList<Order> orders = new ArrayList<Order>();

	public OrderDAO() throws IOException {
		deserialize();
	}

	public ArrayList<Order> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Order.class);
		orders = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return orders;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), orders);
	}
	
	public ArrayList<Order> getAllOrders(){
		return orders;
	}
	
	public ArrayList<Order> getOrdersByRestaurant(String restaurantName) {
		ArrayList<Order> restaurantOrders = new ArrayList<Order>();
		for(Order o: orders) {
			if (o.getRestaurant().equals(restaurantName)) restaurantOrders.add(o);
		}
		return restaurantOrders;
	}
	
	public Order getById(String orderId) {
		for(Order o: orders) {
			if (o.getId().equals(orderId)) return o;
		}
		return null;
	}
	
	public boolean alreadyExists(String orderId) {
		for(Order o: orders) {
			if (o.getId().equals(orderId)) return true;
		}
		return false;
	} 
	
	public boolean addOrder(Order order) throws JsonGenerationException, JsonMappingException, IOException {
		if (alreadyExists(order.getId())) return false;
		orders.add(order);
		serialize();
		return true;
	}
	
	public void setOrderStatus(OrderDTO orderDto) throws JsonGenerationException, JsonMappingException, IOException {
		getById(orderDto.orderId).setStatus(orderDto.status);
		serialize();
	}
	
	public void updateDelivery(DeliveryRequestDTO requestDto) throws JsonGenerationException, JsonMappingException, IOException {
		getById(requestDto.orderId).setDelivererUsername(requestDto.delivererUsername);
		getById(requestDto.orderId).setStatus(OrderStatus.DELIVERING);
		serialize();
	}
}
