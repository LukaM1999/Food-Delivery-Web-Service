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

import beans.Comment;
import beans.CommentApproval;
import services.UserService;

public class CommentDAO {
	
	private final String path = "json/comments.json";

	private ArrayList<Comment> comments = new ArrayList<Comment>();

	public CommentDAO() throws IOException {
		deserialize();
	}

	public ArrayList<Comment> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Comment.class);
		comments = new ObjectMapper().readValue(new String(Files.readAllBytes
				(Paths.get((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path))), typeReference);
		return comments;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File((getClass().getClassLoader().getResource("../").getPath()).replace("/C:", "") + path), comments);
	}

	public void addComment(Comment newComment)
			throws JsonGenerationException, JsonMappingException, IOException {
		comments.add(new Comment(newComment.getPoster(), newComment.getRestaurant(),
				newComment.getContent(), newComment.getRating(), CommentApproval.PROCESSING, newComment.getDate(), newComment.getOrderId()));
		serialize();
	}

	public ArrayList<Comment> getAllComments() {
		return comments;
	}	
	
	public void removeComment(Comment comment) throws JsonGenerationException, JsonMappingException, IOException {
		comments.remove(comment);
		serialize();
	}
	
	public void setCommentApproval(Comment comment) throws JsonGenerationException, JsonMappingException, IOException{
		for(Comment c : comments) {
			if(c.getOrderId().equals(comment.getOrderId())) {
				c.setApproval(comment.getApproval());
				serialize();
				return;
			}
		}
	}

}
