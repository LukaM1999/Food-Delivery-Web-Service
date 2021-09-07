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
			document.documentElement.scrollTop = document.body.scrollTop = 0
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
			this.$nextTick(() => this.$root.initializeRating())
			document.documentElement.scrollTop = document.body.scrollTop = 0
		},
		viewOrders() {
			this.restaurantView = false
			this.restaurantsView = false
			this.ordersView = true
			this.requestsView = false
			this.profileView = false
			document.documentElement.scrollTop = document.body.scrollTop = 0
		},
		viewRequests() {
			this.restaurantView = false
			this.restaurantsView = false
			this.ordersView = false
			this.requestsView = true
			this.profileView = false
			document.documentElement.scrollTop = document.body.scrollTop = 0
		},
		viewProfile() {
			this.restaurantView = false
			this.restaurantsView = false
			this.ordersView = false
			this.requestsView = false
			this.profileView = true
			document.documentElement.scrollTop = document.body.scrollTop = 0
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
					</button> 
					<div class="navbar-brand" style="padding-left:1%; cursor:pointer;" @click="viewRestaurant"><img src="images/logo.png" width="80" height="80"></div>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="padding-right:1%;">
						<ul class="navbar-nav">
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="viewRestaurant">My restaurant</button>
							</li>	
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="viewRestaurants">Restaurants</button>
							</li>
							<li class="nav-item active" style="padding: 5px;">
								<articleCreation v-if="manager.restaurant" :restaurant="manager.restaurant" @article-created="addArticle"></articleCreation>
							</li>						
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="viewOrders">All orders</button>
							</li>	
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="viewRequests">Delivery requests</button>
							</li>
						</ul>
						<ul class="navbar-nav ms-auto">
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark" @click="viewProfile"><i class="fa fa-user fa-5x"></i></button>
							</li>	
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark" @click="$root.logOut()" title="Log out"><i class="fa fa-sign-out fa-5x"></i></button>
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