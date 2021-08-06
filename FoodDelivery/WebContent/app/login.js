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
			if (response.data) {
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
	}
},

	template: `
	<div>
	<restaurants></restaurants>
	<registration></registration>
		<button type="button" class="btn btn-info btn-lg" style="position: absolute; top: 8px; right: 250px;" data-bs-toggle="modal" data-bs-target="#loginModal">Prijavi se</button>
		<div class="modal fade" role="dialog" id="loginModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
          				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        			</div>
					<div class="modal-body">
						<h1 style="color: blue; text-align: center;">Prijavi se</h1>
						<form @submit.prevent="userLogin">
							<table align="center">
								<tr>
									<td style="font-weight: bold;">Korisnicko ime</td>
									<td><input type="text" name="username" v-model="usernameLogin" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Lozinka</td>
									<td><input type="password" name="password" v-model="passwordLogin" required></td>
								</tr>
								<tr>
									<td colspan="2" align="center">
										<button type="submit" class="btn btn-primary" data-bs-dismiss="modal" style="margin-top: 10%;" :disabled="!usernameLogin || !passwordLogin" id="login">
											Prijavi se
										</button>
									</td>
								</tr>
							</table>
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