package beans;

public class CustomerType {
	
	private String typeName;
	private double discount;
	private int pointsRequired;
	
	public CustomerType(String typeName, double discount, int pointsRequired) {
		this.typeName = typeName;
		this.discount = discount;
		this.pointsRequired = pointsRequired;
	}
	
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public double getDiscount() {
		return discount;
	}
	public void setDiscount(double discount) {
		this.discount = discount;
	}
	public int getPointsRequired() {
		return pointsRequired;
	}
	public void setPointsRequired(int pointsRequired) {
		this.pointsRequired = pointsRequired;
	}
	
}
