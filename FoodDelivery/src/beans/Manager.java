package beans;

import java.util.Date;

public class Manager extends User {

	private Restaurant restaurant;
	
	public Manager(String username, String password, String name, String surname, String gender, Date dateOfBirth,
			Role role, UserStatus status, Restaurant restaurant) {
		super(username, password, name, surname, gender, dateOfBirth, role, status);
		this.restaurant = restaurant;
	}
	
	public Manager() {
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

}
