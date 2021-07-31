package beans;

public class CustomerType {

	private String typeName = "Bronze";
	private double discount = 0;
	private int pointsRequired = 3000;

	public CustomerType(String typeName, double discount, int pointsRequired) {
		this.typeName = typeName;
		this.discount = discount;
		this.pointsRequired = pointsRequired;
	}
	
	public CustomerType() {}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public void determineType(double points) {
		switch (typeName) {
		case "Bronze":
			if (points > pointsRequired) {
				typeName = "Silver";
				pointsRequired = 7000;
				discount = 0.03;
			}
		case "Silver":
			if (points > pointsRequired) {
				typeName = "Gold";
				pointsRequired = 0;
				discount = 0.05;
			}
		}
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
