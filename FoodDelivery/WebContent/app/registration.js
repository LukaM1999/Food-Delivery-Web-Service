Vue.component("registration", {
	
	data: function(){
		return {
			username: '',
			password: '',
			name: '',
			surname: '',
			gender: '',
			dateOfBirth: Date.now,
			role: 'CUSTOMER',

			alert: '',
		}
	},

	methods: {
		registerCustomer: function(){
			var customer = {
				username: this.username,
				password: this.password,
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				dateOfBirth: new Date(this.dateOfBirth).format("dd.mm.yyyy."),
				role: this.role
			}
			axios
			.post('rest/user/registerCustomer', customer)
			.then(response => {
				if (response.data) this.alert = this.name + " " + this.surname + " uspesno registrovan!";
				else this.alert = "Vec postoji korisnik sa korisnickim imenom: " + this.username;
				$('#registrationAlert').fadeIn(300).delay(5000).fadeOut(300);
			})
		},
	},

	template: `
	<div>
		<button type="button" class="btn btn-light btn-lg" data-bs-toggle="modal" data-bs-target="#myModal">Register</button>
		<div class="modal fade" role="dialog" id="myModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
          				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        			</div>
					<div class="modal-body">
						<h1 style="color: black; text-align: center;">Register user</h1>
						<form @submit.prevent="registerCustomer">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingUsername" v-model="username" required>
										<label for="floatingUsername">Username*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="password" class="form-control" id="floatingPassword" v-model="password" required>
										<label for="floatingPassword">Password*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingName" v-model="name" required>
										<label for="floatingName">Name*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingSurname" v-model="surname" required>
										<label for="floatingSurname">Last name*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<select class="form-select" id="floatingGender" v-model="gender" required>
											<option value="MALE">Male</option>
											<option value="FEMALE">Female</option>
											<option value="OTHER">Other</option>
										</select>
										<label for="floatingGender">Gender*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="date" class="form-control" id="floatingDate" v-model="dateOfBirth" required="required">
										<label for="floatingDate">Date of birth*</label>
									</div>		
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-primary btn-lg">
										Register
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert"
			id="registrationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});