Vue.component("login", {

	data: function () {
		return {
			usernameLogin: '',
			passwordLogin: '',

			alertLogin: '',
		}
	},

	async mounted() {
		//$('.my-background').css('background-image', "url('images/login-background.png')")
		var self = this
		$('.modal').on('show.bs.modal', async function () {
			let backdrop = await self.getBackdrop()
			backdrop[0].parentNode?.removeChild(backdrop[0])
		})
		await this.getAllComments()
	},

	methods: {
		async userLogin() {
			const loginDto = { username: this.usernameLogin, password: this.passwordLogin }
			const response = await axios.post('rest/user/find', loginDto)
			if (response.data && response.data.status !== 'BLOCKED') {
				const user = await axios.get('rest/user/getUser/' + loginDto.username)
				this.$root.$data.user = user.data
				this.$router.push('/' + this.usernameLogin)
				$('.my-background').css('background-image', "url('images/main-background.jfif')")
			}
			else 
				this.$root.showAlert('Wrong username/password!')
	},

	getBackdrop() {
		return new Promise((resolve, reject) => {
			let backdrop = document.getElementsByClassName('modal-backdrop')
			if (backdrop) {
				resolve(backdrop)
			}
			reject('No backdrop yet')
		})
	},
	async getAllComments() {
		const comments = await axios.get('rest/comment/getAllComments')
		this.$root.$data.comments = comments.data
	},
	viewRestaurants() {
		if (this.$refs.restaurantsRef) {
			this.$refs.restaurantsRef.$data.singleRestaurant = false
			this.$refs.restaurantsRef.$data.allRestaurants = true
		}
		this.$nextTick(() => this.$root.initializeRating())
		document.documentElement.scrollTop = document.body.scrollTop = 0
	},
},

	template: `
	<div>
		<div class="row">
			<div class="col-md-12">
				<nav class="navbar my-navbar navbar-expand-lg navbar-light fixed-top">
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
						<span class="fa fa-3x fa-bars"></span>
					</button> 
					<div class="navbar-brand" style="padding-left:1%; cursor:pointer;" @click="viewRestaurants"><img src="images/logo.png" width="80" height="80"></div>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="padding-right:1%;">
						<ul class="navbar-nav">	
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="viewRestaurants">Restaurants</button>
							</li>					
						</ul>
						<ul class="navbar-nav ms-auto">
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" data-bs-toggle="modal" data-bs-target="#loginModal">Log in</button>
							</li>	
							<li class="nav-item" style="padding: 5px;">
								<registration></registration>
							</li>												
						</ul>
					</div>
				</nav>
			</div>
		</div>
		<restaurants ref="restaurantsRef"></restaurants>
		<div class="modal fade" role="dialog" id="loginModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<h1 style="color: black; text-align: center;">Log in</h1>
						<form @submit.prevent="userLogin">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingUsername" v-model="usernameLogin" required>
										<label for="floatingNameManager">Username*</label>
									</div>		
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="password" class="form-control" id="floatingPassword" v-model="passwordLogin" required>
										<label for="floatingPassword">Password*</label>
									</div>		
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-primary btn-lg" data-bs-dismiss="modal" :disabled="!usernameLogin || !passwordLogin" id="login">
										Log in
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert" id="loginAlert">
			<p>{{alertLogin}}</p>
		</div>
	</div>
	`
});