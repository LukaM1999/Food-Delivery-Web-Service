package dao;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.DeliveryRequest;

public class DeliveryRequestDAO {
	private final String path = "json/requests.json";

	private ArrayList<DeliveryRequest> requests = new ArrayList<DeliveryRequest>();

	public DeliveryRequestDAO() throws IOException {
		deserialize();
	}

	public ArrayList<DeliveryRequest> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				DeliveryRequest.class);
		requests = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return requests;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), requests);
	}
	
	public ArrayList<DeliveryRequest> getAllRequests(){
		return requests;
	}
	
	public DeliveryRequest getRequest(String orderId, String delivererUsername) {
		for(DeliveryRequest r : requests) {
			if (r.getOrderId().equals(orderId) && 
					r.getDelivererUsername().equals(delivererUsername)) return r;
		}
		return null;
	}
	
	public boolean alreadyExists(String orderId, String delivererUsername) {
		for(DeliveryRequest r: requests) {
			if (r.getOrderId().equals(orderId) && r.getDelivererUsername().equals(delivererUsername)) return true;
		}
		return false;
	} 
	
	public boolean addRequest(DeliveryRequest request) throws JsonGenerationException, JsonMappingException, IOException {
		if (alreadyExists(request.getOrderId(), request.getDelivererUsername())) return false;
		requests.add(request);
		serialize();
		return true;
	}
	
	public void removeRequest(DeliveryRequest request) throws JsonGenerationException, JsonMappingException, IOException {
		requests.remove(request);
		serialize();
	}
	
	public void updateStatus(DeliveryRequest request) throws JsonGenerationException, JsonMappingException, IOException {
		getRequest(request.getOrderId(), request.getDelivererUsername()).setStatus("Declined");
		serialize();
	}
	
	public void updateRequests(ArrayList<DeliveryRequest> requests) throws JsonGenerationException, JsonMappingException, IOException {
		this.requests = requests;
		serialize();
	}
}
