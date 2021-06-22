package beans;

public class Comment {

	private Customer commentPoster;
	private Restaurant commentedRestaurant;
	private String commentContent;
	private int rating;

	public Comment(Customer commentPoster, Restaurant commentedRestaurant, String commentContent, int rating) {
		super();
		this.commentPoster = commentPoster;
		this.commentedRestaurant = commentedRestaurant;
		this.commentContent = commentContent;
		this.rating = rating;
	}

	public Customer getCommentPoster() {
		return commentPoster;
	}

	public void setCommentPoster(Customer commentPoster) {
		this.commentPoster = commentPoster;
	}

	public Restaurant getCommentedRestaurant() {
		return commentedRestaurant;
	}

	public void setCommentedRestaurant(Restaurant commentedRestaurant) {
		this.commentedRestaurant = commentedRestaurant;
	}

	public String getCommentContent() {
		return commentContent;
	}

	public void setCommentContent(String commentContent) {
		this.commentContent = commentContent;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

}
