Vue.component("userProfile", {

	data: function () {
		return {
			oldProfile: this.$root.$data.user,
			profile: this.$root.$data.user,
			progress: 0,
			progressColor: '#FF5733',
			alert: '',
		}
	},

	mounted() {
		if (this.oldProfile.points <= 7000) this.progress = this.oldProfile.points * 100 / 7000
		if (this.oldProfile.points > 7000) this.progress = 100
		if (this.oldProfile.points >= 3000 && this.oldProfile.points < 7000) this.progressColor = 'silver'
		if (this.oldProfile.points >= 7000) this.progressColor = 'gold'

	},

	filters: {
	},

	methods: {
		async editProfile() {
			axios
				.put('rest/user/editProfile', { profile: this.profile, oldUsername: this.oldProfile.username })
				.then(response => {
					let oldUsername = this.oldProfile.username
					if (response.data) {
						let selector = "#" + self.oldProfile.username.replace(/\s/g, "")
						$(selector + " .btn-close").click()
						this.$emit('profile-updated', { profile: this.profile, oldUsername: this.oldProfile.username })
						this.oldProfile = response.data
					}
					else {
						self.alert = "An error has occured.";
						$('#alert' + oldUsername).fadeIn(300).delay(5000).fadeOut(300);
					}
				})
		},

	},


	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col text-center" style="padding-top:100px; padding-left:15px;">
				<h1>{{oldProfile.name}}'s profile</h1>
				<div v-if="oldProfile.role === 'CUSTOMER'" class="row mb-3">
					<div class="col">
						<h3>{{oldProfile.type.typeName}} tier</h3>
						<h5 class="text-muted">{{oldProfile.points}} points</h5>
						<h5 class="text-muted" v-if="oldProfile.points < 3000">{{3000 - oldProfile.points}} points to Silver tier</h5>
						<h5 class="text-muted" v-if="oldProfile.points >= 3000 && oldProfile.points < 7000">{{7000 - oldProfile.points}} points to Gold tier</h5>
						<div class="row justify-content-center">
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
		<div class="row mb-3">
			<div class="col-md-4">
				<div class="form-floating">
					<input type="number" class="form-control" id="floatingName" v-model="profile.name" required>
					<label for="floatingName">Name</label>
				</div>
			</div>
			<div class="col-md-4">
				<div class="form-floating">
					<input type="number" class="form-control" id="floatingSurname" v-model="profile.surname" required>
					<label for="floatingSurname">Surname</label>
				</div>
			</div>
		</div>
		<div class="row align-content-center">
			<div class="col d-flex justify-content-center">
				<button type="submit" class="btn btn-primary" style="margin-top: 10%;">
					Save
				</button>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert"
			:id="'#alert' + oldProfile.username">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});