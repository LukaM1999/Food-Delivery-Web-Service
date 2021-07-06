Vue.component("adminRegistration", {

	data: function () {
		return {
			username: '',
			password: '',
			name: '',
			surname: '',
			gender: '',
			dateOfBirth: Date.now,
			role: '',

			alert: '',
		}
	},

	props: {
		isManagerAssigning: {
			type: Boolean,
			default: false
		}
	},

	mounted(){
		if (this.isManagerAssigning) this.role = 'MANAGER'
		$('#restaurantModal').on('hidden.bs.modal', function () {
			$(this).find('form').trigger('reset');
		});		
	},

	methods: {
		registerCustomer: function () {
			var user = {
				username: this.username,
				password: this.password,
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				dateOfBirth: new Date(this.dateOfBirth).format("dd.mm.yyyy."),
				role: this.role
			}
			if (this.role === "DELIVERER") {
				axios
					.post('rest/user/registerDeliverer', user)
					.then(response => {
						if (response.data) {
							this.alert = this.name + " " + this.surname + " uspesno registrovan!";
							this.$emit('deliverer-added', response.data)
							//this.$parent.$data.deliverers.push(response.data);
						}
						else this.alert = "Vec postoji korisnik sa korisnickim imenom: " + this.username;
						$('#registrationAlert').fadeIn(300).delay(5000).fadeOut(300);
					})
			}
			else {
				axios
					.post('rest/user/registerManager', user)
					.then(response => {
						if (response.data) {
							this.alert = this.name + " " + this.surname + " uspesno registrovan!";
							//this.$parent.$data.managers.push(response.data)
							this.$emit('manager-added', response.data);
						}
						else this.alert = "Vec postoji korisnik sa korisnickim imenom: " + this.username;
						$('#registrationAlert').fadeIn(300).delay(5000).fadeOut(300);
					})
			}
		},
	},

	template: `
	<div>
		<button v-if="!isManagerAssigning" type="button" class="btn btn-secondary btn-lg" data-bs-toggle="modal" data-bs-target="#myModal">Registruj korisnika</button>
		<div v-if="!isManagerAssigning" class="modal fade" role="dialog" id="myModal">
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
										<button type="submit" class="btn btn-primary" style="margin-top: 10%;">
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
		<div v-if="isManagerAssigning">
			<div class="row">
				<div class="col">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingUsername">
						<label for="floatingUsername">Manager username</label>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="form-floating">
						<input type="password" class="form-control" id="floatingPassword">
						<label for="floatingPassword">Password</label>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingName">
						<label for="floatingName">First name</label>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingSurname">
						<label for="floatingSurname">Last name</label>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="form-floating">
						<input class="form-control" type="date" id="floatingDate" v-model="dateOfBirth">
						<label for="floatingDate">Date of birth</label>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="form-floating">
						<select class="form-select" v-model="gender" id="floatingGender">
							<option selected value="MALE">Male</option>
							<option value="FEMALE">Female</option>
							<option value="OTHER">Other</option>
						</select>	
						<label for="floatingGender">Gender</label>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!isManagerAssigning" class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert"
			id="registrationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});