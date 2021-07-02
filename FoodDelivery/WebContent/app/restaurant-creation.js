Vue.component("restaurantCreation", {
	
	data: function(){
		return {
			name: '',
			type: '',
			location: '',
			logo: '',

			alert: '',
		}
	},

	methods: {
		registerCustomer: function(){
			var restaurant = {
				name: this.name,
				type: this.type,
				location: this.location,
				logo: this.logo,
			}
			axios
			.post('rest/user/register', restaurant)
			.then(response => {
				if (response.data) this.alert = "Uspesno kreiran restoran!";
				else this.alert = "Vec postoji restoran sa imenom " + this.name;
				$('#registrationAlert').fadeIn(300).delay(5000).fadeOut(300);
			})
		},
	},

	template: `
	<div>
		<button type="button" class="btn btn-secondary btn-lg" data-bs-toggle="modal" data-bs-target="#myModal">Registruj korisnika</button>
		<div class="modal fade" role="dialog" id="myModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
          				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        			</div>
					<div class="modal-body">
						<h1 style="color: blue; text-align: center;">Registruj korisnika</h1>
						<form @submit.prevent="registerCustomer">
							<table align="center">
								<tr>
									<td style="font-weight: bold;">Korisnicko ime</td>
									<td><input type="text" name="username" v-model="username" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Lozinka</td>
									<td><input type="password" name="password" v-model="password" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Ime</td>
									<td><input type="text" name="name" v-model="name" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Prezime</td>
									<td><input type="text" name="surname" v-model="surname" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Pol</td>
									<td>
										<select name="pol" v-model="gender" required>
											<option value="MALE">Musko</option>
											<option value="FEMALE">Zensko</option>
											<option value="OTHER">Ostalo</option>
										</select>
									</td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Datum rodjenja</td>
									<td><input type="date" name="dateOfBirth" v-model="dateOfBirth" required="required">
									</td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Uloga</td>
									<td>
										<select name="pol" v-model="role" required>
											<option value="DELIVERER">Dostavljac</option>
											<option value="MANAGER">Menadzer</option>										
										</select>
									</td>
								</tr>
								<tr>
									<td colspan="2" align="center">
										<button type="submit" class="btn btn-primary" style="margin-top: 10%;" id="register">
											Potvrdi
										</button>
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom z-index: 10000;" style="display:none;" role="alert"
			id="registrationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});