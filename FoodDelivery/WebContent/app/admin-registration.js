Vue.component("adminRegistration", {

	data: function () {
		return {
			username: '',
			password: '',
			name: '',
			surname: '',
			gender: 'MALE',
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

	mounted() {
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
							this.alert = this.name + " " + this.surname + " successfully registered!";
							this.$emit('deliverer-added', response.data)
						}
						else this.alert = `A user with the username ${this.username} already exists.`
						this.$root.showAlert(this.alert)
					})
			}
			else {
				axios
					.post('rest/user/registerManager', user)
					.then(response => {
						if (response.data) {
							this.alert = this.name + " " + this.surname + " successfully registered!"
							this.$emit('manager-added', response.data);
						}
						else this.alert = `A user with the username ${this.username} already exists.`
						this.$root.showAlert(this.alert)
					})
			}
		},
	},

	template: `
	<div>
		<button v-if="!isManagerAssigning" type="button" class="btn btn-secondary btn-lg" data-bs-toggle="modal" data-bs-target="#myModal">Register user</button>
		<div v-if="!isManagerAssigning" class="modal fade" role="dialog" id="myModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
          				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        			</div>
					<div class="modal-body">
						<h1 style="color: blue; text-align: center;">Register user</h1>
						<form @submit.prevent="registerCustomer">
							<table align="center">
								<tr>
									<td style="font-weight: bold;">Username</td>
									<td><input type="text" name="username" v-model="username" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Password</td>
									<td><input type="password" name="password" v-model="password" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Name</td>
									<td><input type="text" name="name" v-model="name" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Surname</td>
									<td><input type="text" name="surname" v-model="surname" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Gender</td>
									<td>
										<select name="pol" v-model="gender" required>
											<option value="MALE">Musko</option>
											<option value="FEMALE">Zensko</option>
											<option value="OTHER">Ostalo</option>
										</select>
									</td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Date of birth</td>
									<td><input type="date" name="dateOfBirth" v-model="dateOfBirth" required="required">
									</td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Role</td>
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
											Submit
										</button>
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
			</div>
		</div>
		<form @submit.prevent="registerCustomer" v-if="isManagerAssigning">
			<div class="row mb-3">
				<div class="col">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingUsername" v-model="username" required>
						<label for="floatingUsername">Manager username*</label>
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
						<label for="floatingName">First name*</label>
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
						<input class="form-control" type="date" id="floatingDate" v-model="dateOfBirth" required>
						<label for="floatingDate">Date of birth*</label>
					</div>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-md-4">
					<div class="form-floating">
						<select class="form-select" id="floatingGender" v-model="gender" required>
							<option selected value="MALE">Male</option>
							<option value="FEMALE">Female</option>
							<option value="OTHER">Other</option>
						</select>	
						<label for="floatingGender">Gender*</label>
					</div>
				</div>
				<div class="col-md-2 align-self-center">
					<button type="submit" class="btn btn-secondary">Register</button>
				</div>
			</div>
		</form>
		<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert"
			id="registrationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});