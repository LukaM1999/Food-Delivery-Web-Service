package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.DeliveryRequest;
import dao.DeliveryRequestDAO;
import dao.ManagerDAO;
import dao.RestaurantDAO;

@Path("/request")
public class DeliveryRequestService {
	
	@Context
	ServletContext ctx;

	public DeliveryRequestService() {}

	@PostConstruct
	public void init() throws IOException {
		// System.out.println(new File(".").getCanonicalPath());
		if (ctx.getAttribute("requests") == null) {
			ctx.setAttribute("requests", new DeliveryRequestDAO());
		}
	}

	@GET
	@Path("/getAllRequests")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<DeliveryRequest> getAllRequests() throws IOException {
		DeliveryRequestDAO requestDao = (DeliveryRequestDAO) ctx.getAttribute("requests");
		return requestDao.getAllRequests();
	}
	
	@GET
	@Path("/getRequest/{request}")
	@Produces(MediaType.APPLICATION_JSON)
	public DeliveryRequest getRequest(@PathParam(value = "request") String request) throws IOException {
		String[] requestSplit = request.split("&&");
		DeliveryRequestDAO requestDao = (DeliveryRequestDAO) ctx.getAttribute("requests");
		return requestDao.getRequest(requestSplit[0], requestSplit[1]);
	}

	@POST
	@Path("/addRequest")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public DeliveryRequest addRequest(DeliveryRequest request) throws JsonGenerationException, JsonMappingException, IOException {
		DeliveryRequestDAO requestDao = (DeliveryRequestDAO) ctx.getAttribute("requests");
		if (!requestDao.addRequest(request)) return null;
		ctx.setAttribute("requests", requestDao);
		return request;
	}
	
	@PUT
	@Path("/updateStatus")
	@Consumes(MediaType.APPLICATION_JSON)
	public void updateStatus(DeliveryRequest request) throws JsonGenerationException, JsonMappingException, IOException {
		DeliveryRequestDAO requestDao = (DeliveryRequestDAO) ctx.getAttribute("requests");
		requestDao.updateStatus(request);
		ctx.setAttribute("requests", requestDao);
	}
	
	@PUT
	@Path("/updateRequests")
	@Consumes(MediaType.APPLICATION_JSON)
	public void updateRequests(ArrayList<DeliveryRequest> requests) throws JsonGenerationException, JsonMappingException, IOException {
		DeliveryRequestDAO requestDao = (DeliveryRequestDAO) ctx.getAttribute("requests");
		requestDao.updateRequests(requests);
		ctx.setAttribute("requests", requestDao);
	}
	
	@DELETE
	@Path("/removeRequests/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public void removeRequests(@PathParam(value = "username") String username) throws JsonGenerationException, JsonMappingException, IOException {
		DeliveryRequestDAO requestDao = (DeliveryRequestDAO) ctx.getAttribute("requests");
		requestDao.removeRequests(username);
		ctx.setAttribute("requests", requestDao);
	}
}
