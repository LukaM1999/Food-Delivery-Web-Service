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
			if(!this.$root.testRegex(this.$root.$data.usernamePattern, this.username, `${this.username} is not a valid username!`)) return
			if(!this.$root.testRegex(this.$root.$data.passwordPattern, this.password, `Password is not valid`)) return
			if(!this.$root.testRegex(this.$root.$data.namePattern, this.name, `${this.name} is not a valid name!`)) return
			if(!this.$root.testRegex(this.$root.$data.namePattern, this.surname, `${this.surname} is not a valid last name!`)) return
			
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
										<input type="text" class="form-control" id="floatingUsername" :pattern="$root.$data.usernamePattern" 
											title= "1. At least 3 characters\n2. No leading or trailing dots"
											v-model="username" required autofocus style="white-space: pre-line;">
										<label for="floatingUsername">Username*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="password" class="form-control" id="floatingPassword" :pattern="$root.$data.passwordPattern"
											title= "1. Minimum 8 characters\n2. At least one uppercase letter\n3. At least one lowercase letter\n4. At least one number" 
											v-model="password" required style="white-space: pre-line;">
										<label for="floatingPassword">Password*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingName" :pattern="$root.$data.namePattern"
										title="1. No numbers\n2. No special characters, except - and '"
										v-model="name" required>
										<label for="floatingName">Name*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingSurname" :pattern="$root.$data.namePattern"
										title="1. No numbers\n2. No special characters, except - and '"
										v-model="surname" required>
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