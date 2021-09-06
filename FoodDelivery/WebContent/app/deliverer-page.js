Vue.component('delivererPage', {

	data: function () {
		return {
			deliverer: this.$root.$data.user,
			ordersView: true,
			restaurantsView: false,
			profileView: false,
			alert: '',
            orders: undefined,
		}
	},


	async mounted() {
        //this.orders = this.$root.$data.orders
	},


	methods: {
		viewRestaurants() {
			this.ordersView = false
			this.restaurantsView = true
			this.profileView = false
			if (this.$refs.restaurantsRef) {
				this.$refs.restaurantsRef.$data.singleRestaurant = false
				this.$refs.restaurantsRef.$data.allRestaurants = true
			}
			this.$nextTick(() => this.$root.initializeRating())
		},
		viewOrders() { 
            this.ordersView = true
			this.restaurantsView = false
			this.profileView = false
		},
		viewProfile() {
			this.ordersView = false
			this.restaurantsView = false
			this.profileView = true
		},
	},

	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col">
				<nav class="navbar my-navbar navbar-expand-lg navbar-light fixed-top">
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
						<span class="fa fa-3x fa-bars"></span>
					</button> <a class="navbar-brand" href="http://localhost:8080/FoodDelivery/"><img src="images/quotations-button.png" width="80" height="80"></a>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul class="navbar-nav">	
                            <li class="nav-item" style="padding: 5px;">
                                <button type="button" class="btn btn-secondary btn-lg" @click="viewOrders">Orders</button>
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
		<userProfile v-if="profileView" deliverer-profile></userProfile>
		<restaurants v-if="restaurantsView" ref="restaurantsRef"></restaurants>
		<orders v-if="ordersView && $root.$data.orders.length > 0"></orders>
	</div>
	`
})