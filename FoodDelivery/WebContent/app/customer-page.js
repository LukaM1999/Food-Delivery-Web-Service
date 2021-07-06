Vue.component('customerPage', {

	data: function () {
		return {
			customer: this.$root.$data.user,
			alert: '',
		}
	},
	

	mounted() {
		
	},

	methods: {
	},

	template: `
	<div class="container-fluid">
	<div class="row">
		<div class="col-md-12">
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bs-example-navbar-collapse-1">
					<span class="navbar-toggler-icon"></span>
				</button> <a class="navbar-brand" href="http://localhost:8080/FoodDelivery/"><img src="images/quotations-button.png" width="80" height="80"></a>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="navbar-nav">
						<li class="nav-item active" style="padding: 5px;">
							 <admin-registration :is-manager-assigning="false"></admin-registration>
						</li>						
						<li class="nav-item active" style="padding: 5px;">
							<restaurantCreation></restaurantCreation>
						</li>						
					</ul>
				</div>
			</nav>
		</div>
	</div>
	<restaurants></restaurants>
</div>
	`
});