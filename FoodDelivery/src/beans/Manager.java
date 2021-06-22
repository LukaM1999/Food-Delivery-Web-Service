package beans;

import java.util.Date;

public class Manager extends User {

	private Restaurant restaurant;
	
	public Manager(String username, String password, String name, String surname, String gender, Date dateOfBirth,
			Role role, Restaurant restaurant) {
		super(username, password, name, surname, gender, dateOfBirth, role);
		this.restaurant = restaurant;
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

}
