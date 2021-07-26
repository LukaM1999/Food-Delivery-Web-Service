package beans;

import java.util.HashMap;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import utilities.ArticleSerializer;
import utilities.ArticleDeserializer;

public class Cart {

	@JsonSerialize(keyUsing = ArticleSerializer.class)
	@JsonDeserialize(keyUsing = ArticleDeserializer.class)
	public HashMap<Article, Integer> articles = new HashMap<Article, Integer>();
	public String ownerUsername;
	public double price;
	
	public Cart(HashMap<Article, Integer> articles, String username, double price) {
		super();
		this.articles = articles;
		this.ownerUsername = username;
		this.price = price;
	}
	
	public Cart() {
		
	}

	public HashMap<Article, Integer> getArticles() {
		return articles;
	}

	public void setArticles(HashMap<Article, Integer> articles) {
		this.articles = articles;
	}

	public String getCartOwner() {
		return ownerUsername;
	}

	public void setCartOwner(String cartOwner) {
		this.ownerUsername = cartOwner;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
	
	
}
