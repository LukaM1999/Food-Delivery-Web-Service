const googleMap = { template: '<googleMap></googleMap>' }

Vue.component("restaurantCreation", {

	data: function () {
		return {
			name: '',
			type: '',
			logo: '',
			loc: null,
			managers: [],
			manager: {},

			alert: '',
		}
	},

	mounted() {
		axios
			.get('rest/user/getAllManagers')
			.then(response => {
				var mngrs = response.data
				mngrs.forEach(element => {
					if (element.restaurant === null) {
						this.managers.push(element);
					}
				});
			});
	},

	components: {
		'googleMap': googleMap,
	},

	methods: {
		createRestaurant() {
			var location, logo;

			axios
				.get('rest/restaurant/getLocation')
				.then(response => {
					this.loc = response.data
					axios.
						get('rest/restaurant/getLogo')
						.then(response => {
							this.logo = response.data
							console.log(response.data)
							var restaurant = {
								name: this.name,
								type: this.type,
								location: this.loc,
								logo: this.logo,
								status: "OPEN",
							}
							var dto = {
								restaurant: restaurant,
								manager: this.manager
							}
							axios
								.post('rest/restaurant/createRestaurant', dto)
								.then(response => {
									if (response.data) this.alert = "Successfully created restaurant!";
									else this.alert = "A restaurant with the name " + this.name + " already exists";
									$('#registrationAlert').fadeIn(300).delay(5000).fadeOut(300);
								})

						});

				});
		},
		getImage(e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length)
				return;
			var file = files[0];
			var reader = new FileReader();
			reader.onloadend = function () {
				var imgType = file.type.split('/');
				var self = this;
				self.logo = reader.result.replace('data:image/' + imgType[1] + ';base64,', '');

				axios
					.post('rest/restaurant/setLogo', self.logo.replace('+', '%2B'))
					.then(response => {
						console.log(self.logo)
						console.log(response.data)
					})
			}
			reader.readAsDataURL(file);
		},
	},

	template: `
	<div>
		<button type="button" class="btn btn-secondary btn-lg" data-bs-toggle="modal" data-bs-target="#restaurantModal">Create restaurant</button>
		<div class="modal fade" role="dialog" id="restaurantModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
          				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        			</div>
					<div class="modal-body">
						<h1 style="color: blue; text-align: center;">Create restaurant</h1>
						<form @submit.prevent="createRestaurant">
							<table align="center">
								<tr>
									<td style="font-weight: bold;">Name: </td>
									<td><input type="text" name="name" v-model="name" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Type: </td>
									<td><input type="text" name="type" v-model="type" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Location: </td>
									<td><googleMap ref="childMap" :parent="_self"></googleMap></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Logo: </td>
									<td><input class="btn btn-secondary" type="file" name="logo" v-on:change="getImage" accept="image/*"></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Manager: </td>
									<td>
										<select name="manager" v-model="manager">
											<option v-for="m in managers" :value="m">
												{{m.username}}
											</option>									
										</select>
									</td>
								</tr>
								<tr>
									<td colspan="2" align="center">
										<button type="submit" class="btn btn-primary" style="margin-top: 10%;">
											Create
										</button>
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom z-index: 10000;" style="display:none;" role="alert"
			id="registrationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});