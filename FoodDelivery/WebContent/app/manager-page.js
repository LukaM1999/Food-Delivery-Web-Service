const articleCreation = { template: '<articleCreation></articleCreation>' }
const deliveryRequests = { template: '<deliveryRequests></deliveryRequests>' }

Vue.component('managerPage', {

	data: function () {
		return {
			manager: this.$root.$data.user,
			restaurantView: true,
			restaurantsView: false,
			ordersView: false,
			requestsView: false,
			profileView: false,
			alert: '',
		}
	},


	mounted() {

	},


	methods: {
		viewRestaurant() {
			this.restaurantView = true
			this.restaurantsView = false
			this.ordersView = false
			this.requestsView = false
			this.profileView = false
		},
		viewRestaurants() {
			this.restaurantView = false
			this.restaurantsView = true
			this.ordersView = false
			this.requestsView = false
			this.profileView = false
			if (this.$refs.restaurantsRef) {
				this.$refs.restaurantsRef.$data.singleRestaurant = false
				this.$refs.restaurantsRef.$data.allRestaurants = true
			}

		},
		viewOrders() {
			this.restaurantView = false
			this.restaurantsView = false
			this.ordersView = true
			this.requestsView = false
			this.profileView = false
		},
		viewRequests() {
			this.restaurantView = false
			this.restaurantsView = false
			this.ordersView = false
			this.requestsView = true
			this.profileView = false
		},
		viewProfile() {
			this.restaurantView = false
			this.restaurantsView = false
			this.ordersView = false
			this.requestsView = false
			this.profileView = true
		},
		addArticle(article) {
			this.$refs.restaurantPage.addArticle(article)
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
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewRestaurant">My restaurant</button>
							</li>	
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewRestaurants">Restaurants</button>
							</li>
							<li class="nav-item active" style="padding: 5px;">
								<articleCreation v-if="manager.restaurant" :restaurant="manager.restaurant" @article-created="addArticle"></articleCreation>
							</li>						
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewOrders">All orders</button>
							</li>	
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-secondary btn-lg" @click="viewRequests">Delivery requests</button>
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
		<restaurantPage v-if="manager.restaurant && restaurantView" :restaurant="manager.restaurant" ref="restaurantPage"></restaurantPage>
		<userProfile v-if="profileView"></userProfile>
		<restaurants v-if="restaurantsView" ref="restaurantsRef"></restaurants>
		<orders v-if="ordersView"></orders>
		<deliveryRequests v-if="requestsView"></deliveryRequests>
	</div>
	`
})