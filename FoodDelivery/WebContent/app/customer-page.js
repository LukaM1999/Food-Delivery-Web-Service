const shoppingCart = { template: "<shoppingCart></shoppingCart>"}

Vue.component('customerPage', {

	data: function () {
		return {
			customer: this.$root.$data.user,
			profileView: false,
			restaurantsView: true,
			currentView: 'restaurantsView',
			alert: '',
		}
	},
	

	mounted() {
		this.$root.$data.cart.ownerUsername = this.customer.username
	},

	methods: {
		openCartResetDialog(view){
			this.currentView = view
			if(this.$root.$data.cart.articles.length > 0) {
				$('#cartModal').modal('show');
			}
			else this.confirmCartReset()
		},
		confirmCartReset(){
			if(this.currentView === 'restaurantsView') this.viewRestaurants()
			if(this.currentView === 'profileView') this.viewProfile()
		},
		viewRestaurants(){
			this.profileView = false
			this.restaurantsView = true
			this.$root.$data.cart = {
				ownerUsername: this.customer.username,
				articles: []
			}
			if(this.$refs.restaurantsRef){
				this.$refs.restaurantsRef.$data.singleRestaurant = false
				this.$refs.restaurantsRef.$data.allRestaurants = true
			}
		},
		viewProfile(){
			this.profileView = true
			this.restaurantsView = false
			this.$root.$data.cart = {
				ownerUsername: this.customer.username,
				articles: []
			}
		},
		dismissCartModal(){
			$('#cartModal').modal('hide')
			let body = document.getElementsByTagName("body")
			body[0].style.overflow = "visible"
			//$('.modal-backdrop').remove();
		}
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
								<button type="button" class="btn btn-secondary btn-lg" @click="openCartResetDialog('restaurantsView')">Restaurants</button>
							</li>					
						</ul>
						<ul class="navbar-nav ms-auto">
							<li class="nav-item" style="padding: 5px;">
								<shoppingCart></shoppingCart>
							</li>
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-secondary" @click="openCartResetDialog('profileView')"><i class="fa fa-user fa-5x"></i></button>
							</li>									
						</ul>
					</div>
				</nav>
			</div>
		</div>
		<restaurants v-if="restaurantsView" ref="restaurantsRef"></restaurants>
		<userProfile v-if="profileView"></userProfile>
		<div>
			<div class="modal fade" role="dialog" id="cartModal">
				<div class="modal-dialog modal-sm modal-dialog-centered" style="width: auto;">
					<div class="modal-content">
						<div class="modal-header" style="background-color: #f72585;">
							<button type="button" class="btn-close" data-bs-dismiss="modal" @click="dismissCartModal"></button>
						</div>
						<div class="modal-body" style="background-color: #b23cfd;">
							<h1 style="color: white; text-align: center;">Confirm cart reset</h1>
							<p>If you leave this page, your shopping cart will be emptied!</p>
						</div>
						<div class="modal-footer">	
							<form @submit.prevent="confirmCartReset">						
								<button type="submit" class="btn btn-primary" style="background-color: #f72585 !important;">
									Confirm
								</button>					
								<button type="button" @click="dismissCartModal" class="btn btn-danger" >
									Cancel
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});