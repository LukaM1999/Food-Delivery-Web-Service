const olmap = { template: '<olmap></olmap>' }

Vue.component("restaurantCreation", {
	
	data: function(){
		return {
			name: '',
			type: '',
			location: '',
			logo: '',
			managers: [],

			alert: '',
		}
	},

	mounted() {
		var managers = this.$parent.$data.managers;
		managers.forEach(element => {
			if(element.restaurant === null){
				this.managers.push(element);
			}
		});
	},

	components: {
		'olmap' : olmap,
	},

	methods: {
		createRestaurant: function(){
			var restaurant = {
				name: this.name,
				type: this.type,
				location: this.location,
				logo: this.logo,
			}
			axios
			.post('rest/restaurant/createRestaurant', restaurant)
			.then(response => {
				if (response.data) this.alert = "Successfully created restaurant!";
				else this.alert = "A restaurant with the name " + this.name + " already exists";
				$('#registrationAlert').fadeIn(300).delay(5000).fadeOut(300);
			})
		},
	},

	template: `
	<div>
		<button type="button" class="btn btn-secondary btn-lg" data-bs-toggle="modal" data-bs-target="#restaurantModal">Create restaurant</button>
		<div class="modal fade" role="dialog" id="restaurantModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
          				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        			</div>
					<div class="modal-body">
						<h1 style="color: blue; text-align: center;">Create restaurant</h1>
						<form @submit.prevent="createRestaurant">
							<table align="center">
								<tr>
									<td style="font-weight: bold;">Name: </td>
									<td><input type="text" name="name" v-model="name" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Type: </td>
									<td><input type="text" name="type" v-model="type" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Location: </td>
									<td><olmap></olmap></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Logo: </td>
									<td><input type="text" name="logo" v-model="logo" required></td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Manager: </td>
									<td>
										<select name="manager">
											<option v-for="m in managers" :value="m">
												{{m.username}}
											</option>									
										</select>
									</td>
								</tr>
								<tr>
									<td colspan="2" align="center">
										<button type="submit" class="btn btn-primary" style="margin-top: 10%;">
											Create
										</button>
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="alert alert-warning fixed-bottom z-index: 10000;" style="display:none;" role="alert"
			id="registrationAlert">
			<p>{{alert}}</p>
		</div>
	</div>
	`
});