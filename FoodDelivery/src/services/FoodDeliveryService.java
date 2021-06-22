package services;

import javax.servlet.ServletContext;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;


@Path("/food")
public class FoodDeliveryService {

	@Context
	ServletContext ctx;
	
	public FoodDeliveryService() {}
	
	public void init() {
		if (ctx.getAttribute("user") == null) {
			//ctx.setAttribute("user", new UserDAO());
		}
	}
	
}
