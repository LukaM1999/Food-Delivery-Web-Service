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
			if(this.$refs.shoppingCart.$data.totalPrice > 0) {
				$('#cartModal').modal('show')
			}
			else this.confirmCartReset()
		},
		confirmCartReset(){
			this.dismissCartModal()
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
		},
		updateArticleAmount(){
			this.$refs.restaurantsRef.updateArticleAmount()
		},
	},

	template: `
	<div class="container-fluid">
		<div class="row">
			<div class="col">
				<nav class="navbar my-navbar navbar-expand-lg navbar-light fixed-top">
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
						<span class="fa fa-3x fa-bars"></span>
					</button> 
					<a class="navbar-brand" style="padding-left:1%;" href="http://localhost:8080/FoodDelivery/"><img src="images/logo.png" width="80" height="80"></a>
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="padding-right:1%;">
						<ul class="navbar-nav">						
							<li class="nav-item active" style="padding: 5px;">
								<button type="button" class="btn btn-dark btn-lg" @click="openCartResetDialog('restaurantsView')">Restaurants</button>
							</li>					
						</ul>
						<ul class="navbar-nav ms-auto">
							<li class="nav-item" style="padding: 5px;">
								<shoppingCart @order-added="updateArticleAmount" ref="shoppingCart"></shoppingCart>
							</li>
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark" @click="openCartResetDialog('profileView')"><i class="fa fa-user fa-5x"></i></button>
							</li>	
							<li class="nav-item" style="padding: 5px;">
								<button type="button" class="btn btn-dark" @click=""><i class="fa fa-sign-out fa-5x"></i></button>
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