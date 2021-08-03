package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.Comment;
import dao.CommentDAO;

@Path("/comment")
public class CommentService {
	@Context
	ServletContext ctx;

	public CommentService() {}

	@PostConstruct
	public void init() throws IOException {
		// System.out.println(new File(".").getCanonicalPath());
		if (ctx.getAttribute("comments") == null) {
			ctx.setAttribute("comments", new CommentDAO());
		}
	}

	@GET
	@Path("/getAllComments")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Comment> getAllComments() throws IOException {
		CommentDAO commentDao = (CommentDAO) ctx.getAttribute("comments");
		return commentDao.getAllComments();
	}

	@POST
	@Path("/addComment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Comment addComment(Comment comment) throws JsonGenerationException, JsonMappingException, IOException {
		CommentDAO commentDao = (CommentDAO) ctx.getAttribute("comments");
		commentDao.addComment(comment); 
		ctx.setAttribute("comments", commentDao);
		return comment;
	}
	
	@PUT
	@Path("/approveComment")
	@Consumes(MediaType.APPLICATION_JSON)
	public void approveComment(Comment comment) throws JsonGenerationException, JsonMappingException, IOException {
		CommentDAO commentDao = (CommentDAO) ctx.getAttribute("comments");
		commentDao.approveComment(comment);
		ctx.setAttribute("comments", commentDao);
	}
	
}
