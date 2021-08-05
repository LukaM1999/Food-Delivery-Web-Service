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

import beans.Article;
import beans.Restaurant;
import dto.ArticleDTO;
import dto.RatingDTO;

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
				restaurant.getStatus(), restaurant.getLocation(), restaurant.getLogo(), 0));
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
	
	public boolean articleExists(Article article) {
		Restaurant restaurant = getRestaurantById(article.getRestaurant());
		for (Article a: restaurant.getArticles()) {
			if (a.getName().equals(article.getName())) return true;
		}
		return false;
	}
	
	
	public void removeRestaurant(Restaurant restaurant) {
		restaurants.remove(restaurant);
	}
	
	public boolean addArticle(Article article) throws JsonGenerationException, JsonMappingException, IOException {
		if (articleExists(article) || article == null) return false;
		Restaurant restaurant = getRestaurantById(article.getRestaurant());
		int indexOfRestaurant = restaurants.indexOf(restaurant);
		removeRestaurant(restaurant);
		restaurant.getArticles().add(article);
		restaurants.add(indexOfRestaurant, restaurant);
		serialize();
		return true;
	}
	
	public boolean editArticle(ArticleDTO articleDto) throws JsonGenerationException, JsonMappingException, IOException {
		if (articleExists(articleDto.article)) return false;
		Restaurant restaurant = getRestaurantById(articleDto.article.getRestaurant());
		if (restaurant == null) return false;
		Article oldArticle = restaurant.getArticle(articleDto.oldName);
		if (oldArticle == null) return false;
		int indexOfRestaurant = restaurants.indexOf(restaurant);
		int indexOfArticle = restaurant.getArticles().indexOf(oldArticle);
		restaurant.removeArticle(oldArticle);
		restaurant.addArticle(indexOfArticle, articleDto.article);
		removeRestaurant(restaurant);
		restaurants.add(indexOfRestaurant, restaurant);
		serialize();
		return true;
	}
	
	public void updateRating(RatingDTO ratingDto) throws JsonGenerationException, JsonMappingException, IOException {
		getRestaurantById(ratingDto.restaurant).setRating(ratingDto.rating);
		serialize();
	}
}
