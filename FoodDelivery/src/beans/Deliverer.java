package beans;

import java.util.Date;

public class Deliverer extends User {

	private Order order;
	
	public Deliverer(String username, String password, String name, String surname, String gender, Date dateOfBirth,
			Role role, Order order) {
		super(username, password, name, surname, gender, dateOfBirth, role);
		this.order = order;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}
}
