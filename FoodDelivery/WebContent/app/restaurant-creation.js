const googleMap = { template: '<googleMap></googleMap>' }

Vue.component("restaurantCreation", {

	data: function () {
		return {
			name: '',
			type: '',
			logo: '',
			loc: {},
			managers: [],
			manager: {},
			street: '',
			streetNumber: '',
			city: '',
			zipCode: '',

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
		$('#restaurantModal').on('hidden.bs.modal', function () {
			$(this).find('form').trigger('reset');
			$('#managerAssign').removeClass('show')
			$('#googleMap').removeClass('show')
		});
	},

	components: {
		googleMap,
	},

	methods: {
		createRestaurant() {
			var self = this
			axios
				.get('rest/restaurant/getLocation')
				.then(response => {
					this.loc = response.data
					axios.
						get('rest/restaurant/getLogo')
						.then(response => {
							this.logo = response.data
							var restaurant = {
								name: this.name,
								type: this.type,
								location: this.loc,
								logo: this.logo,
								status: "OPEN"
							}
							var dto = {
								restaurant: restaurant,
								manager: this.manager
							}
							axios
								.post('rest/restaurant/createRestaurant', dto)
								.then(response => {
									if (response.data) self.alert = "Successfully created restaurant!";
									else {
										self.alert = "A restaurant with the name " + self.name + " already exists";
										$('#restaurantModal').modal('hide')
									}
									$('#restaurantCreationAlert').fadeIn(300).delay(5000).fadeOut(300);
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
			}
			reader.readAsDataURL(file);
		},
		addManager(manager) {
			this.managers.push(manager)
		},
		updateLocation(location) {
			this.street = location.address.street
			this.streetNumber = location.address.streetNumber
			this.city = location.address.city
			this.zipCode = location.address.zipCode
			this.loc = location
		},

	},

	template: `
	<div>
		<button type="button" class="btn btn-secondary btn-lg" data-bs-toggle="modal"
			data-bs-target="#restaurantModal">Create restaurant</button>
		<div class="modal fade" role="dialog" id="restaurantModal">
			<div class="modal-dialog modal-dialog-centered modal-lg" style="width: auto;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<h1 style="color: blue; text-align: center;">Create restaurant</h1>
						<form @submit.prevent="createRestaurant">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingNameManager" v-model="name"
											required>
										<label for="floatingNameManager">Restaurant name</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingType" v-model="type"
											required>
										<label for="floatingType">Restaurant type</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-md-4">
									<div class="form-floating">
										<input type="text" class="form-control" v-model="street"
											id="floatingStreet" required>
										<label for="floatingStreet">Street address</label>
									</div>
								</div>
								<div class="col-md-2">
									<div class="form-floating">
										<input type="text" class="form-control" v-model="streetNumber"
											id="floatingStreetNum" required>
										<label for="floatingStreetNum">Number</label>
									</div>
								</div>
								<div class="col-md-2">
									<div class="form-floating">
										<input type="text" class="form-control" v-model="city" id="floatingCity"
											required>
										<label for="floatingCity">City</label>
									</div>
								</div>
								<div class="col-md-2">
									<div class="form-floating">
										<input type="number" class="form-control" v-model="zipCode"
											id="floatingZip" required>
										<label for="floatingZip">Zipcode</label>
									</div>
								</div>
								<div class="col-md-2 align-self-center">
									<div class="form-check form-switch align-content-center">
										<input class="form-check-input" type="checkbox" id="mapSwitch"
											data-bs-toggle="collapse" data-bs-target="#googleMap">
										<label class="form-check-label" for="mapSwitch">Map</label>
									</div>
								</div>
							</div>
							<div class="row collapsed collapse mb-3" id="googleMap">
								<div class="col d-flex justify-content-center">
									<googleMap @location-selected="updateLocation" key="'gMap'"></googleMap>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<label for="imageFile" class="form-label">Logo image</label>
									<input class="form-control" type="file" id="imageFile" v-on:change="getImage"
										accept="image/*">
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-md-9">
									<div class="form-floating">
										<select class="form-select" id="managerSelect" v-model="managers[0]">
											<option v-for="m in managers" :value="m">
												{{m.username}}
											</option>
										</select>
										<label for="managerSelect">Manager of the restaurant</label>
									</div>
								</div>
								<div class="col-md-3 align-self-center">
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" id="managerCreation"
											data-bs-toggle="collapse" data-bs-target="#managerAssign"
											:disabled="managers.length !== 0">
										<label class="form-check-label" for="managerCreation">Assign manager</label>
									</div>
								</div>
							</div>
							<div class="row collapsed collapse mb-3" id="managerAssign">
								<div class="col">
									<adminRegistration is-manager-assigning v-on:managerAdded="addManager"></adminRegistration>
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-primary"  style="margin-top: 10%;">
										Create
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert"
			id="restaurantCreationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});