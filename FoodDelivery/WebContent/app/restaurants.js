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
			restaurant: this.$root.$data.user?.restaurant,
			typeCheckboxes: [],
		}
	},

	props: {

	},

	async mounted() {
		const restaurants = await axios.get('rest/restaurant/getAllRestaurants')
		this.restaurants = restaurants.data
		this.restaurants.sort(function (a, b) {
				if (a.status < b.status) return 1;
				if (a.status > b.status) return -1;
				return 0;
			})
		this.restaurants.forEach(r => {
			if (this.allTypes.filter((type) => { type.toLowerCase() == r.type.toLowerCase() }).length == 0) {
				this.allTypes.push(r.type)
				this.typeCheckboxes.push(false)
			}
		})
		this.singleRestaurant = false
		this.allRestaurants = true
		this.initializeFilterDropdown()
		this.$nextTick(() => this.initializeRating())
	},

	computed: {
		filteredRestaurants() {
			let tempRestaurants = this.restaurants

			const types = this.allTypes.filter((type, index) => this.typeCheckboxes[index] === true)
			const filteredRestaurants = []
			for (let i = 0; i < types.length; i++) {
				filteredRestaurants.push(...tempRestaurants.filter((r) => {
					return r.type.toLowerCase().includes(types[i].toLowerCase())
				}))
			}

			if (filteredRestaurants.length > 0) tempRestaurants = filteredRestaurants

			if (this.nameSearch != '') {
				tempRestaurants = tempRestaurants.filter((r) => {
					return r.name.toLowerCase().includes(this.nameSearch.toLowerCase())
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

			if (this.ratingSearch != '') {
				tempRestaurants = tempRestaurants.filter((r) => {
					return Math.round(r.rating) === Math.round(this.ratingSearch)
				})
			}

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
					if (addressFormat(a.location.address) > addressFormat(b.location.address)) result = 1
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
		locationFormat(location) {
			return location.longitude + ", " + location.latitude
		},
	},

	methods: {
		viewRestaurant(r) {
			this.restaurant = r
			this.singleRestaurant = true
			this.allRestaurants = false
			document.documentElement.scrollTop = 0
		},
		setSortOrder() {
			this.ascending = !this.ascending
		},
		updateArticleAmount() {
			this.$refs.restaurantPage.updateArticleAmount()
		},
		initializeFilterDropdown() {
			$(".checkbox-menu").on("change", "input[type='checkbox']", function () {
				$(this).closest("li").toggleClass("active", this.checked)
			})
			$('.dropdown-menu.keep-open').on({
				"click": function (e) {
					e.stopPropagation()
					this.closable = false
				}
			})
		},
		initializeRating() {
			$('.rating').each(function () {
				$(this).rating({ showCaption: false, displayOnly: true, step: 0.1 })
			})
		},
		removeRestaurant(restaurant) {
			this.restaurants = this.restaurants.filter(r => r.name !== restaurant.name)
			const manager = this.$parent.$data.managers.find(manager => manager.restaurant?.name === restaurant.name)
			if (manager != null)
				this.$parent.$data.managers.find(manager => manager.restaurant?.name === restaurant.name).restaurant = null
			axios.delete(`rest/restaurant/removeRestaurant/${restaurant.name}`)
			this.$parent.updateManagerSelect(manager)
			this.$root.showAlert(`Successfully removed restaurant ${restaurant.name}!`)
		}
	},

	template: `
	<div>
		<div v-if="allRestaurants" style="padding-top:5%;">
			<h1 class="text-center" style="color:white;">Restaurants</h1>
			<div class="row mt-5 justify-content-center">
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
				<div class="col-md-2 d-flex justify-content-center">
					<button class="btn btn-lg btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
						data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
						Select types
					</button>
					<ul class="dropdown-menu checkbox-menu allow-focus keep-open" aria-labelledby="dropdownMenu1">
						<li v-for="(type, i) in allTypes">
							<label>
								<input type="checkbox" v-model="typeCheckboxes[i]">
								{{type}}
							</label>
						</li>
					</ul>
				</div>
				<div class="col-md-1">
					<div class="form-floating">
						<input type="number" class="form-control" id="restaurantRating" v-model.number="ratingSearch" max="5"
							min="0">
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
				<div class="col-md-1 align-self-center">
					<input type="checkbox" class="form-check-input" id="onlyOpen" v-model="onlyOpen">
					<label for="onlyOpen" style="color:white;">Only open</label>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="menu-box">
						<div class="container">
							<div class="row">
								<div v-for="r in filteredRestaurants" class="col-md-4 mb-4">
									<div class="card text-center h-100 my-shadow restaurant-card" :style="[r.status === 'CLOSED' ? {opacity:0.5} : {}]" 
									@click="viewRestaurant(r)">
										<button class="btn btn-danger top-0 position-absolute start-100 translate-middle"
											style="z-index: 10;" title="Delete" v-if="$root.user?.role === 'ADMIN'"
											@click.stop="removeRestaurant(r)">
											<span class="fa fa-trash fa-2x"></span>
										</button>
										<div class="card-body">
											<div class="embed-responsive embed-responsive-16by9">
												<img :src="'data:image/png;base64,' + r.logo"
													class="card-img-top embed-responsive-item" alt="Image">
											</div>
											<h2 class="card-title">{{r.name}}</h2>
											<h6 style="color: gray;"><i>{{r.type}}</i></h6>
											<h5>{{r.location.address | addressFormat}}</h5>
											<h6 style="color: gray;">{{r.location | locationFormat}}</h6>
											<h5 style="color: black;"><i>{{r.status}}</i></h5>
										</div>
										<div class="card-footer">
											<div class="row">
												<div class="col align-self-center">
													<input class="rating rating-loading"
														v-model="r.rating" data-min="0" data-max="5" data-step="0.1">
													<h5>{{r?.rating.toFixed(1)}}</h5>
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
		<restaurantPage v-if="singleRestaurant" ref="restaurantPage" :restaurant="restaurant"></restaurantPage>
	</div>
	`
});