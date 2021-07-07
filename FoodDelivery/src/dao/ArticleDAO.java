package dao;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.Article;
import beans.Restaurant;

public class ArticleDAO {

	private final String path = "json/articles.json";

	private ArrayList<Article> articles = new ArrayList<Article>();

	public ArticleDAO() throws IOException {
		deserialize();
	}

	public ArrayList<Article> deserialize() throws IOException {
		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(ArrayList.class,
				Restaurant.class);
		articles = new ObjectMapper().readValue(new String(Files.readAllBytes(Paths.get(path))), typeReference);
		return articles;
	}

	public void serialize() throws JsonGenerationException, JsonMappingException, IOException {
		new ObjectMapper().writeValue(new File(path), articles);
	}

	public boolean alreadyCreated(Article article) {
		for (Article a : articles) {
			if (a.getName().equals(article.getName()))
				return true;
		}
		return false;
	}

	public boolean addArticle(Article article)
			throws JsonGenerationException, JsonMappingException, IOException {
		if (alreadyCreated(article))
			return false;
		articles.add(new Article(article.getName(), article.getPrice(), article.getType(),
				article.getRestaurant(), article.getQuantity(), article.getDescription(), article.getImage()));
		serialize();
		return true;
	}

	public Article getArticleById(String name) {
		for (Article a : articles) {
			if (a.getName().equals(name))
				return a;
		}
		return null;
	}
}
