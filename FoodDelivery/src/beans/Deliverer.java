package beans;

import java.util.ArrayList;
import java.util.Date;

public class Deliverer extends User {

	private ArrayList<Order> orders = new ArrayList<Order>();
	
	public Deliverer(String username, String password, String name, String surname, String gender, Date dateOfBirth,
			Role role) {
		super(username, password, name, surname, gender, dateOfBirth, role);
	}
	
	public Deliverer() {
		// TODO Auto-generated constructor stub
	}

	public ArrayList<Order> getOrders() {
		return orders;
	}

	public void setOrder(ArrayList<Order> orders) {
		this.orders = orders;
	}
}
