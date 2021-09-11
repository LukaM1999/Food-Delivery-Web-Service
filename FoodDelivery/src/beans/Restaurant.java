package beans;

import java.util.ArrayList;

public class Restaurant {

	private String name;
	private String type;
	private ArrayList<Article> articles = new ArrayList<Article>();
	private RestaurantStatus status;
	private Location location;
	private String logo;
	private double rating;

	public Restaurant(String name, String type, ArrayList<Article> articles, RestaurantStatus status,
			Location location, String logo, double rating) {
		super();
		this.name = name;
		this.type = type;
		this.articles = articles;
		this.status = status;
		this.location = location;
		this.logo = logo;
		this.rating = rating;
	}

	public Restaurant() {
		// TODO Auto-generated constructor stub
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public ArrayList<Article> getArticles() {
		return articles;
	}

	public void setArticles(ArrayList<Article> articles) {
		this.articles = articles;
	}

	public RestaurantStatus getStatus() {
		return status;
	}

	public void setStatus(RestaurantStatus status) {
		this.status = status;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}
	
	public Article getArticle(String name) {
		for(Article a: articles) {
			if(name.equals(a.getName())) return a;
		}
		return null;
	}
	
	public void addArticle(int index, Article article) {
		articles.add(index, article);
	}
	
	public void removeArticle(Article article) {
		articles.remove(getArticle(article.getName()));
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

}
