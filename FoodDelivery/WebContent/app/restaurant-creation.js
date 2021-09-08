const googleMap = { template: '<googleMap></googleMap>' }

Vue.component("restaurantCreation", {

	data() {
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
		}
	},

	mounted() {
		this.setFreeManagers()
		$('#restaurantModal').on('hidden.bs.modal', function () {
			$(this).find('form').trigger('reset');
			$('#managerAssign').removeClass('show')
			$('#googleMap').removeClass('show')
		})
	},

	components: {
		googleMap,
	},

	methods: {
		setFreeManagers() {
			axios
				.get('rest/user/getAllManagers')
				.then(response => {
					var mngrs = response.data
					this.managers = []
					mngrs.forEach(element => {
						if (element.restaurant === null && element.status != 'BLOCKED') {
							this.managers.push(element)
						}
					})
					this.manager = this.managers[0]
				})
		},
		async createRestaurant() {
			this.loc.address = {
				street: this.street,
				streetNumber: this.streetNumber,
				city: this.city,
				zipCode: this.zipCode,
			}
			const geoLocation = await axios
				.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.street}%20${this.streetNumber}%20${this.city}
				&key=AIzaSyBk-FoX9VMB6msn3skG2-P0xM6JMRhPH3k`)
			this.loc.latitude = geoLocation.data.results[0].geometry.location.lat
			this.loc.longitude = geoLocation.data.results[0].geometry.location.lng
			var fileInput = document.getElementById('imageFile')
			if (fileInput.files.length === 0 ) return
			const restaurant = {
				name: this.name,
				type: this.type,
				location: this.loc,
				logo: fileInput.files[0].name,
				status: "OPEN",
				rating: 0
			}
			const dto = {
				restaurant: restaurant,
				manager: this.manager
			}
			const response = await axios.post('rest/restaurant/createRestaurant', dto)
			if (response.data) {
				this.$root.showAlert(`Successfully created restaurant ${restaurant.name}!`)
				$("#restaurantModal .btn-close").click()
				this.setFreeManagers()
				this.$emit('restaurant-created', dto)
			}
			else {
				this.$root.showAlert(`A restaurant with the name ${restaurant.name} already exists.`)
				$('#restaurantModal').modal('hide')
			}
		},
		addManager(manager) {
			this.managers.push(manager)
			this.manager = this.managers[0]
			this.$emit('manager-added', manager)
			$('#managerCreation').prop('checked', false)
			$('#managerAssign').removeClass('show')
		},
		removeManager(manager){
			this.managers = this.managers.filter(m => manager.username !== m.username)
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
		<button type="button" class="btn btn-dark btn-lg" data-bs-toggle="modal"
			data-bs-target="#restaurantModal">Create restaurant</button>
		<div class="modal fade" role="dialog" id="restaurantModal">
			<div class="modal-dialog modal-dialog-centered modal-lg" style="width: auto;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<h1 style="text-align: center;">Create restaurant</h1>
						<form @submit.prevent="createRestaurant">
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingNameManager" v-model="name"
											required autofocus>
										<label for="floatingNameManager">Restaurant name*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<div class="form-floating">
										<input type="text" class="form-control" id="floatingType" v-model="type"
											required>
										<label for="floatingType">Restaurant type*</label>
									</div>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-md-4">
									<div class="form-floating">
										<input type="text" class="form-control" v-model="street"
											id="floatingStreet" required>
										<label for="floatingStreet">Street address*</label>
									</div>
								</div>
								<div class="col-md-2">
									<div class="form-floating">
										<input type="text" class="form-control" v-model="streetNumber"
											id="floatingStreetNum" required>
										<label for="floatingStreetNum">Number*</label>
									</div>
								</div>
								<div class="col-md-2">
									<div class="form-floating">
										<input type="text" class="form-control" v-model="city" id="floatingCity"
											required>
										<label for="floatingCity">City*</label>
									</div>
								</div>
								<div class="col-md-2">
									<div class="form-floating">
										<input type="number" class="form-control" v-model="zipCode"
											id="floatingZip" required>
										<label for="floatingZip">Zipcode*</label>
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
									<label for="imageFile" class="form-label">Logo image*</label>
									<input class="form-control" type="file" id="imageFile" accept="image/*" required>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-md-9">
									<div class="form-floating">
										<select class="form-select" id="managerSelect" v-model="manager" required> 
											<option v-for="m in managers" :value="m">
												{{m.username}}
											</option>
										</select>
										<label for="managerSelect">Manager of the restaurant*</label>
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
									<adminRegistration is-manager-assigning @manager-added="addManager"></adminRegistration>
								</div>
							</div>
							<div class="row align-content-center">
								<div class="col d-flex justify-content-center">
									<button type="submit" class="btn btn-dark btn-lg">
										Create
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
});