Vue.component("restaurants", {

	data: function () {
		return {
			restaurants: [],
		}
	},

	mounted() {
		axios
			.get('rest/restaurant/getAllRestaurants')
			.then(response => {
				this.restaurants = response.data
				this.restaurants
					.sort(function (a, b) {
						if (a.status < b.status) return 1;
						if (a.status > b.status) return -1;
						return 0;
					})
			});
	},

	filters: {
		addressFormat(value) {
			return value.street + " " + value.streetNumber + ", " + value.city + " " + value.zipCode;
		}
	},

	methods: {
		viewRestaurant(r){
			this.$router.push('/restaurants/' + r.name);
		}
	},

	template: `
		<div class="row">
			<div class="col-md-12">
				<div class="menu-box">
					<div class="container">
						<div class="row">
							<div class="col-lg-12">
								<div class="heading-title text-center">
									<h2>Restorani</h2>
								</div>
							</div>
						</div>
						<a href="#" id="back-to-top" title="Back to top" style="display: none;"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></a>
						<div class="row inner-menu-box">
							<div class="col-20">
								<div class="tab-content" id="v-pills-tabContent">
									<div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
										<div class="row">
											<div class="col-lg-4 col-md-6 special-grid drinks" v-for="r in restaurants">
												<div @click="viewRestaurant(r)" class="gallery-single fix" style="cursor: pointer; text-align:center;" >
													<img :style="[ r.status === 'CLOSED' ? {opacity:0.2} : {opacity:1} ]" :src="'data:image/png;base64,' + r.logo" class="img-fluid" alt="Image">
													<div class="why-text">
														<h2 style="color: white;">{{r.name}}</h2>
														<h6 style="color: white;"><i>{{r.type}}</i></h6>
														<h5>{{r.location.address | addressFormat}}</h5>
														<p></p>
														<h5 style="color: black;"><i>{{r.status}}</i></h5>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>	
			</div>
		</div>
	</div>
	`
});