package beans;

public class Comment {

	private String commentPoster;
	private String commentedRestaurant;
	private String commentContent;
	private int rating;

	public Comment(String commentPoster, String commentedRestaurant, String commentContent, int rating) {
		super();
		this.commentPoster = commentPoster;
		this.commentedRestaurant = commentedRestaurant;
		this.commentContent = commentContent;
		this.rating = rating;
	}
	
	public Comment() {
		
	}

	public String getCommentPoster() {
		return commentPoster;
	}

	public void setCommentPoster(String commentPoster) {
		this.commentPoster = commentPoster;
	}

	public String getCommentedRestaurant() {
		return commentedRestaurant;
	}

	public void setCommentedRestaurant(String commentedRestaurant) {
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
