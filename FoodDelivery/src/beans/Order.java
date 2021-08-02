package beans;

import java.util.ArrayList;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Order {

	private String id;
	private ArrayList<String> orderedArticles = new ArrayList<String>();
	private String restaurant;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy. HH:mm:ss")
	private Date orderTime;
	private double price;
	private String customerName;
	private String delivererUsername;
	private OrderStatus status;

	public Order(String id, ArrayList<String> orderedArticles, String restaurant, Date orderTime,
			double price, String customerName, String delivererUsername, OrderStatus status) {
		super();
		this.id = id;
		this.orderedArticles = orderedArticles;
		this.restaurant = restaurant;
		this.orderTime = orderTime;
		this.price = price;
		this.customerName = customerName;
		this.delivererUsername = delivererUsername;
		this.status = status;
	}
	
	public Order() {}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public ArrayList<String> getOrderedArticles() {
		return orderedArticles;
	}

	public void setOrderedArticles(ArrayList<String> orderedArticles) {
		this.orderedArticles = orderedArticles;
	}

	public String getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(String restaurant) {
		this.restaurant = restaurant;
	}

	public String getDelivererUsername() {
		return delivererUsername;
	}

	public void setDelivererUsername(String delivererUsername) {
		this.delivererUsername = delivererUsername;
	}

	public Date getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(Date orderTime) {
		this.orderTime = orderTime;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

}
