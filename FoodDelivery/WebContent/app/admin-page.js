Vue.component("adminPage", {

	data: function () {
		return {
			admin: this.$root.$data.user,
			alert: '',
			customers: [],
			deliverers: [],
			managers: [],
			admins: [],
			childKey: 0,
		}
	},
	

	mounted() {
		this.$router.push({ name: 'users'});
	},

	methods: {
		addManager(manager){
			//this.managers.push(manager)
			//this.$refs.users.addManager(manager)
			this.$refs.users.managers.push(manager)
			this.childKey += 1;
		},
		addDeliverer(deliverer){
			
			this.$refs.users.addDeliverer(deliverer)
			this.childKey += 1;
		},
		viewRestaurants(){
			this.$router.push({ name: 'restaurants'});
		},
		viewUsers(){
			this.$router.push({ name: 'users'});
		},
	},

	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-12">
				<nav class="navbar navbar-expand-lg navbar-light bg-light">
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
						<i class="fa fa-bars" aria-hidden="true"></i>
					</button> 
					<a class="navbar-brand" href="http://localhost:8080/FoodDelivery/"><img src="images/quotations-button.png" width="80" height="80"></a>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul class="navbar-nav">
							<li class="nav-item active" style="padding: 5px;">
								<admin-registration :is-manager-assigning="false" ref="adminRegistration" @manager-added="addManager" @deliverer-added="addDeliverer"></admin-registration>
							</li>						
							<li class="nav-item active" style="padding: 5px;">
								<restaurantCreation ref="restaurantCreation"></restaurantCreation>
							</li>		
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewRestaurants">Restaurants</button>
							</li>
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewUsers" :key="childKey">Users</button>
							</li>					
						</ul>
					</div>
				</nav>
			</div>
		</div>
		<div class="row">
			<router-view ref="users"> </router-view>
			
		</div>
	</div>
	`
});