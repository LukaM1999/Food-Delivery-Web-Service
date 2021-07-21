package beans;


public class Article {

	private String name;
	private double price;
	private ArticleType type;
	private String restaurantName;
	private int quantity;
	private String description;
	private String image;
	
	public Article(String name, double price, ArticleType type, String restaurantName, int quantity,
			String description, String image) {
		super();
		this.name = name;
		this.price = price;
		this.type = type;
		this.restaurantName = restaurantName;
		this.quantity = quantity;
		this.description = description;
		this.image = image;
	}
	
	public Article() {
		
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public ArticleType getType() {
		return type;
	}

	public void setType(ArticleType type) {
		this.type = type;
	}

	public String getRestaurant() {
		return restaurantName;
	}

	public void setRestaurant(String restaurantName) {
		this.restaurantName = restaurantName;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}
	
}
