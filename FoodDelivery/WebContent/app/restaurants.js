function addressFormat(value) {
	return value.street + " " + value.streetNumber + ", " + value.city + " " + value.zipCode;
}

Vue.component("restaurants", {

	data: function () {
		return {
			restaurants: [],
			ascending: true,
			sortBy: '',
			nameSearch: '',
			typeSearch: '',
			locationSearch: '',
			ratingSearch: 0,
			onlyOpen: false,
			allTypes: [],
			allRestaurants: true,
			singleRestaurant: false,
			restaurant: {},
		}
	},

	props: {

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
				this.restaurants.forEach(r => {
					if (this.allTypes.filter((type) => { type.toLowerCase() == r.type.toLowerCase() }).length == 0)
						this.allTypes.push(r.type)
				});
			});
	},

	computed: {
		filteredRestaurants() {
			let tempRestaurants = this.restaurants

			if (this.nameSearch != '') {
				tempRestaurants = tempRestaurants.filter((r) => {
					return r.name.toLowerCase().includes(this.nameSearch.toLowerCase())
				})
			}

			if (this.typeSearch != '') {
				tempRestaurants = tempRestaurants.filter((r) => {
					return r.type.toLowerCase().includes(this.typeSearch.toLowerCase())
				})
			}

			if (this.locationSearch != '') {
				tempRestaurants = tempRestaurants.filter((r) => {
					return r.location.address.street.toLowerCase().includes(this.locationSearch.toLowerCase())
						|| r.location.address.streetNumber.toString().toLowerCase().includes(this.locationSearch.toLowerCase())
						|| r.location.address.city.toLowerCase().includes(this.locationSearch.toLowerCase())
						|| r.location.address.zipCode.toString().toLowerCase().includes(this.locationSearch.toLowerCase())
				})
			}

			/* if (this.ratingSearch != '') {
				tempRestaurants = tempRestaurants.filter((r) => {
					return r.averageRating >= this.ratingSearch
				})
			} */

			tempRestaurants = tempRestaurants.sort((a, b) => {
				if (this.sortBy == 'Name') {
					var result = 0
					if (a.name < b.name) result = -1
					if (a.name > b.name) result = 1
					if (this.ascending) return result
					return result * -1
				}
				else if (this.sortBy == 'Location') {
					var result = 0
					if (addressFormat(a.location.address) < addressFormat(b.location.address)) result = -1
					if (addressFormat(a.location.address) > addressFormat(b.location.address)) result =  1
					if (this.ascending) return result
					return result * -1
				}
				else if (this.sortBy == 'Rating') {
					if (this.ascending) return a - b
					return b - a
				}
			})

			if (this.onlyOpen) tempRestaurants = tempRestaurants.filter((r) => { return r.status == 'OPEN' })

			return tempRestaurants
		}
	},

	filters: {
		addressFormat(value) {
			return value.street + " " + value.streetNumber + ", " + value.city + " " + value.zipCode;
		},
		locationFormat(location){
			return location.longitude + ", " + location.latitude
		},
	},

	methods: {
		viewRestaurant(r) {
			//this.$router.push('/restaurants/' + r.name);
			this.restaurant = r;
			this.singleRestaurant = true;
			this.allRestaurants = false;
		},
		setSortOrder() {
			this.ascending = !this.ascending
		}
	},

	template: `
		<div class="row">
			<div class="col-md-12" v-if="allRestaurants">
				<div class="menu-box">
					<div class="container">
						<div class="row">
							<div class="col-lg-12">
								<div class="heading-title text-center">
									<h2>Restaurants</h2>
								</div>
							</div>
						</div>
						<div class="row mb-5">
							<div class="col-md-2">
								<div class="form-floating">
									<input type="text" class="form-control" id="restaurantName" v-model="nameSearch">
									<label for="restaurantName">Restaurant name</label>
								</div>
							</div>
							<div class="col-md-2">
								<div class="form-floating">
									<input type="text" class="form-control" id="restaurantLocation" v-model="locationSearch">
									<label for="restaurantLocation">Location</label>
								</div>
							</div>
							<div class="col-md-2">
								<div class="form-floating">
									<input list="types" id="restaurantType" class="form-control" v-model="typeSearch">
									<datalist id="types" v-for="type in allTypes">
										<option v-for="type in allTypes" :value="type">{{type}}</option>
									</datalist>
									<label for="restaurantType">Type</label>
								</div>
							</div>
							<div class="col-md-1">
								<div class="form-floating">
									<input type="number" class="form-control" id="restaurantRating" v-model="ratingSearch" max="5" min="1">
									<label for="restaurantRating">Rating</label>
								</div>
							</div>
							<div class="col-md-2">
								<div class="form-floating">
									<select v-model="sortBy" class="form-select" id="restaurantSort">
										<option value="">None</option>
										<option value="Name">Name</option>
										<option value="Location" selected>Location</option>
										<option value="Rating">Rating</option>									
									</select>
									<label for="restaurantSort">Sort by</label>
								</div>
							</div>
							<div class="col-md-1 align-self-center d-flex justify-content-center">
								<button class="btn btn-primary" @click="setSortOrder">
      								<i :class="[ascending ? 'fa fa-sort-up' : 'fa fa-sort-down']"></i>
    							</button>
							</div>
							<div class="col-md-2 align-self-center">
								<input type="checkbox" class="form-check-input" id="onlyOpen" v-model="onlyOpen">
								<label for="onlyOpen">Only open</label>
							</div>
						</div>
						<a href="#" id="back-to-top" title="Back to top" style="display: none;"><i class="fa fa-angle-up" aria-hidden="true"></i></a>
						<div class="row inner-menu-box">
							<div class="col-20">
								<div class="tab-content" id="v-pills-tabContent">
									<div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
										<div class="row">
											<div class="col-lg-4 col-md-6 special-grid drinks" v-for="r in filteredRestaurants">
												<div @click="viewRestaurant(r)" class="gallery-single fix" style="cursor: pointer; text-align:center;" >
													<img :style="[ r.status === 'CLOSED' ? {opacity:0.2} : {opacity:1} ]" :src="'data:image/png;base64,' + r.logo" class="img-fluid" alt="Image">
													<div class="why-text">
														<h2 style="color: white;">{{r.name}}</h2>
														<h6 style="color: white;"><i>{{r.type}}</i></h6>
														<h5>{{r.location.address | addressFormat}}</h5>
														<h6 style="color: gray;">{{r.location | locationFormat}}</h6>
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
			<restaurantPage v-if="singleRestaurant" :restaurant="restaurant"></restaurantPage>
		</div>
	</div>
	`
});