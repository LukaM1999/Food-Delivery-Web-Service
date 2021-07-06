Vue.component("restaurantPage", {
	
	data(){
		return {
			restaurant: null,
		}
	},

	mounted(){
		axios
			.get('rest/restaurant/getRestaurant/' + this.$route.params.name)
			.then(response => this.restaurant = response.data)
	},


	template: `
	<div class="row">
		<div class="col-md-12">
			<div class="menu-box">
				<div class="container">
					<div class="row">
						<div class="col-lg-12">
							<div class="heading-title text-center">
								<h2>{{restaurant?.name}}</h2>
							</div>
						</div>
					</div>
				</div>	
			</div>
		</div>
	</div>
	`
});