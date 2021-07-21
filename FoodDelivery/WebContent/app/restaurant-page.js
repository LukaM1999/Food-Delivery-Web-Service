const staticMap = {template: '<staticMap></staticMap>'}
const articles = {template: '<articles></articles>'}

Vue.component("restaurantPage", {
	
	data(){
		return {
			r: null,
			comments: false 
		}
	},

	mounted(){
		axios
			.post('rest/restaurant/setLocation', this.restaurant.location)
			.then(response => { this.r = this.restaurant });
	},

	props: {
		restaurant: {}
	},

	components: {
		staticMap,
		
	},

	filters: {
		addressFormat(value) {
			return value.street + " " + value.streetNumber + ", " + value.city + " " + value.zipCode;
		},
		locationFormat(location){
            return location.longitude + ", " + location.latitude
        },
	},

	template: `
	<div class="row">
		<div class="col-md-12" style="padding-top:15px; padding-left:15px;">
			<div v-if="this.$root.$data.user">
				<button v-if="this.$root.$data.user?.role !== 'MANAGER'" type="button" class="btn btn-info btn-lg">Back</button>
			</div>
			<div v-else>
				<button type="button" class="btn btn-info btn-lg">Back</button>
			</div>
			<div>
			<button type="button" class="btn btn-secondary btn-lg">Articles</button>
			</div>
			<div>
			<button type="button" class="btn btn-secondary btn-lg">Comments</button>
			</div>
			<div class="menu-box">
				<div class="container">
					<a href="#" id="back-to-top" title="Back to top" style="display: none;"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></a>
					<div class="row" style="text-align: center;">
						<div class="row justify-content-center">
							<div class="col-md-6 align-self-center special-grid drinks" >
								<img v-if="restaurant" :src="'data:image/jpeg;base64,' + restaurant.logo" class="img-fluid" alt="Image">
							</div>
							<div class="col-md-6 align-self-center">
								<h1>{{restaurant.name}}</h1>
								<h5>{{restaurant.type}}</h5>
								<h5>{{restaurant.status}}</h5>
							</div>
						</div>
						<div class="row" >
							<div class="col-md-12">
								<h2>*****</h2>
							</div>
						</div>
						<div class="row justify-content-center">
							<div class="col-md-12"
								<h3>{{restaurant.location.address | addressFormat}}</h3>
								<h6 style="color:gray;" >{{restaurant.location | locationFormat}}</h6>
								<staticMap v-if="r"></staticMap>
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr style="border-color: black; height: 5px;">
			<articles v-if="r" :single-restaurant="r.name"></articles>
		</div>
	</div>	
	`
});