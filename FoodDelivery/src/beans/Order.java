package beans;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class Order {

	private String id;
	private ArrayList<Article> orderedArticles = new ArrayList<Article>();
	private Restaurant restaurant;
	private LocalDateTime orderTime;
	private double price;
	private String customerName;
	private OrderStatus status;

	public Order(String id, ArrayList<Article> orderedArticles, Restaurant restaurant, LocalDateTime orderTime,
			double price, String customerName, OrderStatus status) {
		super();
		this.id = id;
		this.orderedArticles = orderedArticles;
		this.restaurant = restaurant;
		this.orderTime = orderTime;
		this.price = price;
		this.customerName = customerName;
		this.status = status;
	}
	
	public Order() {
		// TODO Auto-generated constructor stub
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public ArrayList<Article> getOrderedArticles() {
		return orderedArticles;
	}

	public void setOrderedArticles(ArrayList<Article> orderedArticles) {
		this.orderedArticles = orderedArticles;
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

	public LocalDateTime getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(LocalDateTime orderTime) {
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
