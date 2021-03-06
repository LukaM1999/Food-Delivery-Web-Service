Vue.component("adminPage", {

	data: function () {
		return {
			admin: this.$root.$data.user,
			alert: '',
			customers: [],
			deliverers: [],
			managers: [],
			admins: [],
			showUsers: true,
			showRestaurants: false,
			profileView: false,
			usersKey: 0,
		}
	},


	mounted() {
		axios
			.get('rest/user/getAllCustomers')
			.then(response => {
				this.customers = response.data
			});
		axios
			.get('rest/user/getAllDeliverers')
			.then(response => {
				this.deliverers = response.data
			});
		axios
			.get('rest/user/getAllManagers')
			.then(response => {
				this.managers = response.data
			});
		axios
			.get('rest/user/getAllAdmins')
			.then(response => {
				this.admins = response.data
			});
	},

	methods: {
		addManager(manager) {
			this.managers.push(manager)
			this.usersKey += 1
			this.$refs.restaurantCreation.addManager(manager)
		},
		addUser(manager) {
			this.managers.push(manager)
			this.usersKey += 1
		},
		removeManager(manager) {
			this.managers = this.managers.filter(m => manager.username !== m.username)
			this.$refs.restaurantCreation.removeManager(manager)
		},
		blockManager(manager) {
			this.$refs.restaurantCreation.removeManager(manager)
		},
		addDeliverer(deliverer) {
			this.deliverers.push(deliverer)
			this.usersKey += 1
		},
		addRestaurant(restaurantDto) {
			this.$refs.restaurantsRef?.$data.restaurants.push(restaurantDto.restaurant)
			this.managers.find(m => m.username === restaurantDto.manager.username).restaurant = restaurantDto.restaurant
			this.$nextTick(() => {
				$('.rating').each(function () {
					$(this).rating({ showCaption: false, displayOnly: true, step: 0.1 })
				})
			})
		},
		updateManagerSelect(manager) {
			if (typeof (manager) !== 'undefined')
				this.$refs.restaurantCreation.addManager(manager)
		},
		viewRestaurants() {
			this.showRestaurants = true
			this.showUsers = false
			this.profileView = false
			if (this.$refs.restaurantsRef) {
				this.$refs.restaurantsRef.$data.singleRestaurant = false
				this.$refs.restaurantsRef.$data.allRestaurants = true
			}
			this.$nextTick(() => this.$root.initializeRating())
			document.documentElement.scrollTop = document.body.scrollTop = 0
		},
		viewUsers() {
			this.showRestaurants = false
			this.profileView = false
			this.showUsers = true
			document.documentElement.scrollTop = document.body.scrollTop = 0
		},
		viewProfile() {
			this.showRestaurants = false
			this.showUsers = false
			this.profileView = true
			document.documentElement.scrollTop = document.body.scrollTop = 0
		},
	},

	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-12">
				<nav class="navbar my-navbar navbar-expand-lg navbar-light fixed-top">
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
						<span class="fa fa-3x fa-bars"></span>
					</button> 
					<div class="navbar-brand" style="padding-left:1%; cursor:pointer;" @click="viewUsers"><img src="images/logo.png" width="80" height="80"></div>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="padding-right:1%;">
						<ul class="navbar-nav">
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="viewUsers">Users</button>
							</li>
							<li class="nav-item active" style="padding: 5px;">
								<admin-registration :is-manager-assigning="false" ref="adminRegistration" @manager-added="addManager" @deliverer-added="addDeliverer"></admin-registration>
							</li>						
							<li class="nav-item active" style="padding: 5px;">
								<restaurantCreation ref="restaurantCreation" @manager-added="addUser" @restaurant-created="addRestaurant"></restaurantCreation>
							</li>		
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="viewRestaurants">Restaurants</button>
							</li>					
						</ul>
						<ul class="navbar-nav ms-auto">
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark" @click="viewProfile" title="Profile"><i class="fa fa-user fa-5x"></i></button>
							</li>	
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark" @click="$root.logOut()" title="Log out"><i class="fa fa-sign-out fa-5x"></i></button>
							</li>												
						</ul>
					</div>
				</nav>
			</div>
		</div>
		<div class="row">
			<users @manager-removed="removeManager" @manager-blocked="blockManager" v-if="showUsers" :key="usersKey"></users>
			<restaurants v-if="showRestaurants" ref="restaurantsRef"></restaurants>
			<userProfile v-if="profileView"></userProfile>
		</div>
	</div>
	`
});