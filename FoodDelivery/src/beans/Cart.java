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
	public User cartOwner;
	public double price;
	
	public Cart(HashMap<Article, Integer> articles, User cartOwner, double price) {
		super();
		this.articles = articles;
		this.cartOwner = cartOwner;
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

	public User getCartOwner() {
		return cartOwner;
	}

	public void setCartOwner(User cartOwner) {
		this.cartOwner = cartOwner;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
	
	
}
