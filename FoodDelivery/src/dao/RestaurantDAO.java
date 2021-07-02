package dao;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.Article;
import beans.Restaurant;
import beans.RestaurantStatus;
import beans.RestaurantType;

public class RestaurantDAO {

	private final String path = "json/restaurants.json";

	private ArrayList<Restaurant> restaurants = new ArrayList<Restaurant>();

	public RestaurantDAO() throws IOException {
		deserialize();
	}

	public ArrayList<Restaurant> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Restaurant.class);
		restaurants = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return restaurants;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), restaurants);
	}

	public boolean alreadyCreated(Restaurant restaurant) {
		for (Restaurant r : restaurants) {
			if (r.getName().equals(restaurant.getName()))
				return true;
		}
		return false;
	}

	public boolean addRestaurant(Restaurant restaurant)
			throws JsonGenerationException, JsonMappingException, IOException {
		if (alreadyCreated(restaurant))
			return false;
		restaurants.add(new Restaurant(restaurant.getName(), restaurant.getType(), new ArrayList<Article>(),
				restaurant.getStatus(), restaurant.getLocation(), restaurant.getLogo()));
		serialize();
		return true;
	}

	public Restaurant getRestaurantById(String name) {
		for (Restaurant r : restaurants) {
			if (r.getName().equals(name))
				return r;
		}
		return null;
	}
}
