Vue.component("userProfile", {

	data: function () {
		return {
			oldProfile: this.$root.$data.user,
			profile: Object.assign({}, this.$root.$data.user),
			oldPassword: '',
			progress: 0,
			progressColor: '#FF5733',
		}
	},

	props: {
		delivererProfile: {
			type: Boolean,
			default: false
		},
	},

	mounted() {
		this.updateProgress()
		this.profile.password = ''
	},

	methods: {
		updateProgress() {
			if (this.oldProfile.points < 3000) {
				this.progressColor = '#FF5733'
				this.oldProfile.type.name = 'Bronze'
				this.oldProfile.type.discount = 0
			}
			if (this.oldProfile.points <= 7000) this.progress = this.oldProfile.points * 100 / 7000
			if (this.oldProfile.points >= 3000 && this.oldProfile.points < 7000) {
				this.progressColor = 'silver'
				this.oldProfile.type.name = 'Silver'
				this.oldProfile.type.discount = 0.03
			}
			if (this.oldProfile.points >= 7000) {
				this.progress = 100
				this.progressColor = 'gold'
			}
		},
		async editProfile() {
			const { type, points, orders, dateOfBirth, cart, restaurant, status, ...editedProfile } = this.profile
			const response = await axios.put('rest/user/editProfile',
				{ ...editedProfile, oldUsername: this.oldProfile.username, oldPassword: this.oldProfile.password })
			let oldUsername = this.oldProfile.username
			if (response.data) {
				this.oldProfile = response.data
				this.$root.$data.user = this.oldProfile
				if (response.data.username !== oldUsername) this.$router.replace(`/${response.data.username}`)
				this.$root.showAlert('Successfully edited profile information!')
			}
			else
				this.$root.showAlert('An error has occured')
			this.oldPassword = ''
			this.profile.password = ''
		},

	},


	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col text-center">
				<h1 style="padding-top: 60px; color:white;">{{oldProfile.name}}'s profile</h1>
				<div v-if="oldProfile.role === 'CUSTOMER'" class="row mb-3">
					<div class="col">
						<h3 style="color:navajowhite;">{{oldProfile.type.typeName}} tier</h3>
						<h5 style="color:navajowhite;">{{oldProfile.points.toFixed(2)}} points</h5>
						<h5 style="color:navajowhite;" v-if="oldProfile.points < 3000">{{(3000 - oldProfile.points).toFixed(2)}} points to Silver tier</h5>
						<h5 style="color:navajowhite;" v-if="oldProfile.points >= 3000 && oldProfile.points < 7000">{{(7000 - oldProfile.points).toFixed(2)}} points to Gold tier</h5>
						<div class="row mb-3 justify-content-center">
							<div class="col-md-4">
								<div class="progress" style="height: 20px; border-radius: 10px;">
									<div class="progress-bar" role="progressbar" :style="{width: progress + '%', backgroundColor: progressColor}"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<form @submit.prevent="editProfile">
			<div class="row mb-3 justify-content-center">
				<div class="col-md-3">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingProfileUsername" v-model="profile.username" readonly>
						<label for="floatingProfileUsername">Username</label>
					</div>
				</div>
			</div>
			<div class="row mb-3 justify-content-center">
				<div class="col-md-3">
					<div class="form-floating">
						<input type="password" class="form-control" 
						id="floatingOldPassword" v-model="oldPassword"
						:readonly="oldProfile.password === oldPassword"> 
						<label for="floatingOldPassword">Password</label>
					</div>
				</div>
				<div class="col-md-3">
					<div class="form-floating">
						<input type="password" class="form-control" id="floatingProfilePassword" 
						:readonly="oldProfile.password !== oldPassword" v-model="profile.password"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
						<label for="floatingProfilePassword">New password</label>
					</div>
				</div>
			</div>
			<div class="row mb-3 justify-content-center">
				<div class="col-md-3">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingProfileName" v-model="profile.name" 
						:readonly="oldProfile.password !== oldPassword" required>
						<label for="floatingProfileName">Name</label>
					</div>
				</div>
				<div class="col-md-3">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingProfileSurname" v-model="profile.surname" 
						:readonly="oldProfile.password !== oldPassword" required>
						<label for="floatingProfileSurname">Surname</label>
					</div>
				</div>
			</div>
			<div class="row mb-3 justify-content-center">
				<div class="col-md-3">
					<div class="form-floating">
						<input type="text" class="form-control" id="floatingProfileDate" v-model="profile.dateOfBirth" readonly>
						<label for="floatingProfileDate">Date of birth</label>
					</div>
				</div>
				<div class="col-md-3">
					<div class="form-floating">
						<select class="form-select" id="genderSelect" v-model="profile.gender" 
						:disabled="oldProfile.password !== oldPassword">
							<option value="MALE">Male</option>
							<option value="FEMALE">Female</option>
							<option value="OTHER">Other</option>
						</select>
						<label for="genderSelect">Gender</label>
					</div>
				</div>
			</div>
			<div class="row mb-5 justify-content-center">
				<div class="col-md d-flex justify-content-center">
					<button type="submit" class="btn btn-lg btn-primary" :disabled="oldProfile.password !== oldPassword">
						Save
					</button>
				</div>
			</div>
		</form>
		<orders inside-profile v-if="oldProfile.role === 'CUSTOMER' || oldProfile.role === 'DELIVERER' "></orders>
	</div>
	`
});