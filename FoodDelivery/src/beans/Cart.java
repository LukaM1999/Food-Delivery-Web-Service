package beans;

import java.util.HashMap;

public class Cart {

	public HashMap<Article, Integer> articles = new HashMap<Article, Integer>();
	public User cartOwner;
	public double price;
	
	public Cart(HashMap<Article, Integer> articles, User cartOwner, double price) {
		super();
		this.articles = articles;
		this.cartOwner = cartOwner;
		this.price = price;
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
