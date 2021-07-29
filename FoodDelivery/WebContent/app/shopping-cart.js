Vue.component('shoppingCart', {

	data: function () {
		return {
			cart: this.$root.$data.cart,
			totalPrice: 0
		}
	},

	mounted() {
		
	},

	watch: {
		'$root.$data.cart': function (newValue, oldValue) {
			if(typeof(newValue) !== 'undefined') {
				this.cart = newValue
				this.totalPrice = this.cart.articles.reduce((total, article) => {
					return total + article.price * article.amount
				}, 0)
			}
		}
	},

	methods: {
	
	},

	template: `
	<div>
		<button class="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
			<i class="fa fa-shopping-cart fa-5x"></i>
		</button>
		<div class="offcanvas offcanvas-end my-canvas" tabindex="-1" id="offcanvasRight" data-bs-scroll="true"  style="width:40%;" aria-labelledby="offcanvasRightLabel">
			<div class="offcanvas-header">
				<h5 id="offcanvasRightLabel">Shopping cart</h5>
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			</div>
			<div class="offcanvas-body">
				<div class="row d-flex justify-content-end">
					<div class="col">
						<div class="card mb-3" style="max-width: 540px; height: 140px;" v-for="a in cart?.articles" v-if="a.amount > 0">
							<div class="row g-0">
								<div class="col-md-8">
									<div class="card-body">
										<h5 class="card-title">{{a.name}}</h5>
										<p class="card-text">Amount: {{a.amount}}</p>
										<p class="card-text">Price: {{a.amount * a.price}}</p>
									</div>
								</div>
								<div class="col-md-4">
									<img :src="'data:image/png;base64,' + a.image" class="img-fluid rounded-start" alt="Image">
								</div>
							</div>
						</div>
					</div>
				</div>	

			</div>
			<div class="offcanvas-footer">
				<div class=" fixed-bottom row align-items-center" style="position:absolute; background-color:white; height: 8%;">
					<div class="col align-items-center">
						<div class="row align-items-center">
							<div class="col align-self-center">
								<h5>Total price: {{totalPrice}}</h5>
							</div>
							<div class="col align-items-center">
								<button class="btn btn-secondary" >
									Confirm order
								</button>
							</div>
						</div>			
					</div>
				</div>
			</div>	
		</div>
	</div>
	`
});