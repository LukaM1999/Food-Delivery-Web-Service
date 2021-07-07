package services;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Article;
import beans.Customer;
import beans.Location;
import beans.Restaurant;
import dao.ArticleDAO;
import dao.CustomerDAO;
import dao.ManagerDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.RestaurantDTO;

@Path("/article")
public class ArticleService {

	@Context
	ServletContext ctx;

	public ArticleService() {
	}

	@PostConstruct
	public void init() throws IOException {
		System.out.println(new File(".").getCanonicalPath());
		if (ctx.getAttribute("articles") == null) {
			ctx.setAttribute("articles", new ArticleDAO());
		}
		if (ctx.getAttribute("managers") == null) {
			ctx.setAttribute("managers", new ManagerDAO());
		}
		if (ctx.getAttribute("logo") == null) {
			ctx.setAttribute("logo", "");
		}
	}

	@GET
	@Path("/getAllArticles")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Article> getAllArticles() throws IOException {
		ArticleDAO dao = (ArticleDAO) ctx.getAttribute("articles");
		return dao.deserialize();
	}

	@POST
	@Path("/createArticle")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Article createArticle(Article article) {
		ArticleDAO dao1 = (ArticleDAO) ctx.getAttribute("articles");
		try {
			if (dao1.addArticle(article)) {
				ctx.setAttribute("articles", dao1);
				return dao1.getArticleById(article.getName());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@GET
	@Path("/getLogo")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public String getLogo() throws UnsupportedEncodingException {
		System.out.println((String)ctx.getAttribute("logo"));
		return URLEncoder.encode((String) ctx.getAttribute("logo"), StandardCharsets.UTF_8.name());
	}
	
	@POST
	@Path("/setLogo")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String setLogo(String logo) throws UnsupportedEncodingException {
		ctx.setAttribute("logo", URLDecoder.decode(logo, StandardCharsets.UTF_8.name()));
		return logo;
	}
	
	@GET
	@Path("/getArticle/{name}")
	@Produces(MediaType.APPLICATION_JSON)
	public Article getArticle(@PathParam(value = "name") String name) {
		ArticleDAO dao = (ArticleDAO) ctx.getAttribute("articles");
		return dao.getArticleById(name);
	}
	
}
