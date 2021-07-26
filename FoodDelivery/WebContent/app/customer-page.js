const shoppingCart = { template: "<shoppingCart></shoppingCart>"}

Vue.component('customerPage', {

	data: function () {
		return {
			customer: this.$root.$data.user,
			profileView: false,
			restaurantsView: true,
			alert: '',
		}
	},
	

	mounted() {
		
	},

	methods: {
		viewRestaurants(){
			this.profileView = false
			this.restaurantsView = true
		},
		viewProfile(){
			this.profileView = true
			this.restaurantsView = false
		},
	},

	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-12">
				<nav class="navbar my-navbar navbar-expand-lg navbar-light fixed-top">
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
						<span class="fa fa-3x fa-bars"></span>
					</button> <a class="navbar-brand" href="http://localhost:8080/FoodDelivery/"><img src="images/quotations-button.png" width="80" height="80"></a>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul class="navbar-nav">						
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewRestaurants">Restaurants</button>
							</li>					
						</ul>
						<ul class="navbar-nav ms-auto">
							<li class="nav-item" style="padding: 5px;">
								<shoppingCart></shoppingCart>
							</li>
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-secondary" @click="viewProfile"><i class="fa fa-user fa-5x"></i></button>
							</li>									
						</ul>
					</div>
				</nav>
			</div>
		</div>
		<restaurants v-if="restaurantsView"></restaurants>
		<userProfile v-if="profileView"></userProfile>

	</div>
	`
});