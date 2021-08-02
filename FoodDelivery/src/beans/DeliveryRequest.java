package beans;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class DeliveryRequest {
	private String orderId;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy. HH:mm:ss")
	private Date requestTime;
	private double orderPrice;
	private String delivererUsername;
	private String restaurant;
	private String status;
	
	public DeliveryRequest() {}
	
	public DeliveryRequest(String orderId, Date requestTime, double orderPrice, String delivererUsername, String restaurant, String status) {
		super();
		this.orderId = orderId;
		this.requestTime = requestTime;
		this.orderPrice = orderPrice;
		this.delivererUsername = delivererUsername;
		this.restaurant = restaurant;
		this.status = status;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Date getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(Date requestTime) {
		this.requestTime = requestTime;
	}

	public double getOrderPrice() {
		return orderPrice;
	}

	public void setOrderPrice(double orderPrice) {
		this.orderPrice = orderPrice;
	}

	public String getDelivererUsername() {
		return delivererUsername;
	}

	public void setDelivererUsername(String delivererUsername) {
		this.delivererUsername = delivererUsername;
	}
	
	public String getRestaurant() {
		return restaurant;
	}
	
	public void setRestaurant(String restaurant) { 
		this.restaurant = restaurant;
	}
}
