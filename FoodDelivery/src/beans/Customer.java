package beans;

import java.util.ArrayList;
import java.util.Date;

public class Customer extends User {

	private ArrayList<Order> orders = new ArrayList<Order>();
	private Cart cart;
	private double points;
	private CustomerType type;
	
	public Customer(String username, String password, String name, String surname, String gender, Date dateOfBirth,
			Role role, ArrayList<Order> orders, Cart cart, double points, CustomerType type) {
		super(username, password, name, surname, gender, dateOfBirth, role);
		this.orders = orders;
		this.cart = cart;
		this.points = points;
		this.type = type;
	}
	
	public Customer() {}

	public ArrayList<Order> getOrders() {
		return orders;
	}

	public void setOrders(ArrayList<Order> orders) {
		this.orders = orders;
	}

	public Cart getCart() {
		return cart;
	}

	public void setCart(Cart cart) {
		this.cart = cart;
	}

	public double getPoints() {
		return points;
	}

	public void setPoints(double points) {
		this.points = points;
	}

	public CustomerType getType() {
		return type;
	}

	public void setType(CustomerType type) {
		this.type = type;
	}
	
	
}
