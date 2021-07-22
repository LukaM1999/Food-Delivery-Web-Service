package dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ProfileDTO {
	
	public String oldUsername;
	public String oldPassword;
	public String username;
	public String password;
	public String name;
	public String surname;
	public String gender;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy.")
	public Date dateOfBirth;

}
