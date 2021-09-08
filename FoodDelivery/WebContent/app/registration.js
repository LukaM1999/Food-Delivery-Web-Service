Vue.component("registration", {

	data: function () {
		return {
			username: '',
			password: '',
			name: '',
			surname: '',
			gender: 'MALE',
			dateOfBirth: 'dd.mm.yyyy.',
			role: 'CUSTOMER',
		}
	},

	mounted() {
		$('.my-date').each(function () {
			$(this).datepicker({ format: 'dd.mm.yyyy.' })
		})
	},

	methods: {
		async registerCustomer() {
			if (!moment(this.dateOfBirth, 'DD.MM.YYYY.', true).isValid()) {
				this.$root.showAlert(`${this.dateOfBirth} is not a valid date!`)
				return
			}
			const customer = {
				username: this.username,
				password: this.password,
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				dateOfBirth: new Date(moment(this.dateOfBirth, 'DD.MM.YYYY.')).format("dd.mm.yyyy."),
				role: this.role
			}
			const response = await axios.post('rest/user/registerCustomer', customer)
			if (response.data) this.$root.showAlert(`${this.name} ${this.surname} successfully registered!`)
			else this.$root.showAlert(`A user with the username ${this.username} already exists`)
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
										<input type="text" class="form-control" id="floatingUsername" v-model="username" required autofocus>
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
										<input type="text" class="form-control my-date" id="floatingDate" v-model="dateOfBirth" required="required">
										<label for="floatingDate">Date of birth*</label>
									</div>		
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-dark btn-lg">
										Register
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
})