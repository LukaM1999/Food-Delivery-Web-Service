Vue.component("adminRegistration", {

	data: function () {
		return {
			username: '',
			password: '',
			name: '',
			surname: '',
			gender: 'MALE',
			dateOfBirth: 'dd.mm.yyyy.',
			role: 'DELIVERER',
		}
	},

	props: {
		isManagerAssigning: {
			type: Boolean,
			default: false
		}
	},

	mounted() {
		let self = this
		if (this.isManagerAssigning) this.role = 'MANAGER'
		$('#myModal').on('hidden.bs.modal', function () {
			self.username = ''
			self.password = ''
			self.name = ''
			self.surname = ''
			self.dateOfBirth = 'dd.mm.yyyy.'
		})
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
			const user = {
				username: this.username,
				password: this.password,
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				dateOfBirth: new Date(moment(this.dateOfBirth, 'DD.MM.YYYY.')).format("dd.mm.yyyy."),
				role: this.role
			}
			if (this.role === "DELIVERER") {
				const response = await axios.post('rest/user/registerDeliverer', user)
				if (response.data) {
					this.$root.showAlert(`${this.name} ${this.surname} successfully registered!`)
					this.$emit('deliverer-added', response.data)
					if (!this.isManagerAssigning) $("#myModal .btn-close").click()
				}
				else this.$root.showAlert(`A user with the username ${this.username} already exists`)
				return
			}
			const response = await axios.post('rest/user/registerManager', user)
			if (response.data) {
				$("#myModal .btn-close").click()
				this.$root.showAlert(`${this.name} ${this.surname} successfully registered!`)
				this.$emit('manager-added', response.data)
			}
			else this.$root.showAlert(`A user with the username ${this.username} already exists`)
		},
	},

	template: `
	<div>
		<button v-if="!isManagerAssigning" type="button" class="btn btn-dark btn-lg" data-bs-toggle="modal" data-bs-target="#myModal">Register user</button>
		<div v-if="!isManagerAssigning" class="modal fade" role="dialog" id="myModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
          				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        			</div>
					<div class="modal-body">
						<h1 style="text-align: center;">Register user</h1>
						<form @submit.prevent="registerCustomer" id="userRegisterForm">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" autofocus class="form-control" id="floatingUsername"	v-model="username" required
										:pattern="$root.$data.usernamePattern"
										title= "1. At least 3 characters\n2. No leading or trailing dots"				
										>
										<label for="floatingUsername">Username*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="password" class="form-control" id="floatingPassword" v-model="password" required
										:pattern="$root.$data.passwordPattern"
										title= "1. Minimum 8 characters\n2. At least one uppercase letter\n3. At least one lowercase letter\n4. At least one number"
										>
										<label for="floatingPassword">Password*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingName" v-model="name" required
										:pattern="$root.$data.namePattern"
										title="1. No numbers\n2. No special characters, except - and '">
										<label for="floatingName">First name*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingSurname" v-model="surname" required
										:pattern="$root.$data.namePattern"
										title="1. No numbers\n2. No special characters, except - and '">
										<label for="floatingSurname">Last name*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input class="form-control my-date" type="text" id="floatingDate" v-model="dateOfBirth" required>
										<label for="floatingDate">Date of birth*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<select class="form-select" id="floatingGender" v-model="gender" required>
											<option selected value="MALE">Male</option>
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
										<select class="form-select" id="floatingRole" v-model="role" required>
											<option selected value="DELIVERER">Deliverer</option>
											<option value="MANAGER">Manager</option>										
										</select>
										<label for="floatingRole">Role*</label>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-dark btn-lg">Register</button>	
								</div>			
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<form @submit.prevent="registerCustomer" v-if="isManagerAssigning">
			<div class="row mb-3">
				<div class="col">
					<div class="form-floating">
						<input type="text" class="form-control" id="mngrUsername" v-model="username" required
							:pattern="$root.$data.usernamePattern"
							title= "1. At least 3 characters\n2. No leading or trailing dots">
						<label for="mngrUsername">Manager username*</label>
					</div>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col">
					<div class="form-floating">
						<input type="password" class="form-control" id="mngrPassword" v-model="password" required
							:pattern="$root.$data.passwordPattern"
							title= "1. Minimum 8 characters\n2. At least one uppercase letter\n3. At least one lowercase letter\n4. At least one number"
							>
						<label for="mngrPassword">Password*</label>
					</div>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col">
					<div class="form-floating">
						<input type="text" class="form-control" id="mngrName" v-model="name" required
							:pattern="$root.$data.namePattern"
							title="1. No numbers\n2. No special characters, except - and '">
						<label for="mngrName">First name*</label>
					</div>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col">
					<div class="form-floating">
						<input type="text" class="form-control" id="mngrSurname" v-model="surname" required
							:pattern="$root.$data.namePattern"
							title="1. No numbers\n2. No special characters, except - and '">
						<label for="mngrSurname">Last name*</label>
					</div>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col">
					<div class="form-floating">
						<input class="form-control my-date" type="text" id="mngrDate" v-model="dateOfBirth" required>
						<label for="mngrDate">Date of birth*</label>
					</div>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-md-4">
					<div class="form-floating">
						<select class="form-select" id="mngrGender" v-model="gender" required>
							<option selected value="MALE">Male</option>
							<option value="FEMALE">Female</option>
							<option value="OTHER">Other</option>
						</select>	
						<label for="mngrGender">Gender*</label>
					</div>
				</div>
				<div class="col-md-2 align-self-center">
					<button type="submit" class="btn btn-primary">Register</button>
				</div>
			</div>
		</form>
	</div>
	`
});