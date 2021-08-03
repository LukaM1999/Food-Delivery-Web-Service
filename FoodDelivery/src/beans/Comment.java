package beans;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Comment {

	private String orderId;
	private String poster;
	private String restaurant;
	private String content;
	private double rating;
	private boolean approved;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy.")
	private Date date;

	public Comment(String commentPoster, String commentedRestaurant, String commentContent, double rating,
			boolean approved, Date commentDate, String orderId) {
		super();
		this.poster = commentPoster;
		this.restaurant = commentedRestaurant;
		this.content = commentContent;
		this.rating = rating;
		this.approved = approved;
		this.date = commentDate;
		this.orderId = orderId;
	}
	
	public Comment() {	
	}

	public String getPoster() {
		return poster;
	}

	public void setPoster(String poster) {
		this.poster = poster;
	}

	public String getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(String restaurant) {
		this.restaurant = restaurant;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	
	
}
