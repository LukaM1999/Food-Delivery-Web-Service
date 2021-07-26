Vue.component('shoppingCart', {

	data: function () {
		cart: this.$root.$data.cart
	},
	

	mounted() {
		
	},

	methods: {
	
	},

	template: `
	<div>
		<button class="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
			<i class="fa fa-shopping-cart fa-5x"></i>
		</button>
		<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" data-bs-scroll="true" style="width:40%;" aria-labelledby="offcanvasRightLabel">
			<div class="offcanvas-header">
				<h5 id="offcanvasRightLabel">Offcanvas right</h5>
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			</div>
			<div class="offcanvas-body large">
				...
			</div>
		</div>
	</div>
	`
});