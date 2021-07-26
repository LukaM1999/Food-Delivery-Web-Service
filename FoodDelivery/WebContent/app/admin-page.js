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
		//this.$router.push({ name: 'users'});
	},

	methods: {
		addManager(manager){
			this.managers.push(manager)
			this.usersKey += 1
		},
		addDeliverer(deliverer){		
			this.deliverers.push(deliverer)
			this.usersKey += 1
		},
		viewRestaurants(){
			this.showRestaurants = true
			this.showUsers = false
			this.profileView = false
		},
		viewUsers(){
			this.showRestaurants = false
			this.profileView = false
			this.showUsers = true
		},
		viewProfile(){
			this.showRestaurants = false
			this.showUsers = false
			this.profileView = true
		},
	},

	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-12">
				<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
						<span class="fa fa-3x fa-bars"></span>
					</button> 
					<a class="navbar-brand" href="http://localhost:8080/FoodDelivery/"><img src="images/quotations-button.png" width="80" height="80"></a>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul class="navbar-nav">
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewUsers">Users</button>
							</li>
							<li class="nav-item active" style="padding: 5px;">
								<admin-registration :is-manager-assigning="false" ref="adminRegistration" @manager-added="addManager" @deliverer-added="addDeliverer"></admin-registration>
							</li>						
							<li class="nav-item active" style="padding: 5px;">
								<restaurantCreation ref="restaurantCreation"></restaurantCreation>
							</li>		
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewRestaurants">Restaurants</button>
							</li>					
						</ul>
						<ul class="navbar-nav ms-auto">
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-secondary" @click="viewProfile"><i class="fa fa-user fa-5x"></i></button>
							</li>												
						</ul>
					</div>
				</nav>
			</div>
		</div>
		<div class="row">
			<users v-show="showUsers" :key="usersKey"></users>
			<restaurants v-show="showRestaurants"></restaurants>
			<userProfile v-show="profileView"></userProfile>
		</div>
	</div>
	`
});