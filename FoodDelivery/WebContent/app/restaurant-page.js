const staticMap = { template: '<staticMap></staticMap>' }
const articles = { template: '<articles></articles>' }
const comments = { template: `<comments></comments>` }

Vue.component("restaurantPage", {

	data() {
		return {
			r: null,
			ratingCount: 0,
			navbarHeight: 0,
		}
	},

	async mounted() {
		await axios.post('rest/restaurant/setLocation', this.restaurant.location)
		this.r = this.restaurant
		this.refreshRating()
		this.$nextTick(() => {
			const navbar = document.getElementsByClassName('my-navbar')
			this.navbarHeight = navbar[0].offsetHeight
		})
	},

	props: {
		restaurant: {
			type: Object,
			default: null
		}
	},

	components: {
		staticMap,
	},

	methods: {
		addArticle(article) {
			this.$refs.articlesRef.$data.articles.push(article)
		},
		updateArticleAmount() {
			this.$refs.articlesRef.updateArticleAmount()
		},
		initializeRating() {
			$('.rating').each(function () {
				$(this).rating({ showCaption: false, displayOnly: true, step: 1 })
			})
		},
		initializeRatingOverId() {
			$('#restaurantRating').rating({ showCaption: false, displayOnly: true, step: 0.1 })
			$("#restaurantRating").rating("update", this.r.rating)
		},
		calculateRating() {
			const ratings = this.$root.$data.comments.flatMap(c => c.restaurant === this.r.name && c.approval === 'APPROVED' ? c.rating : [])
			const ratingSum = ratings.reduce((total, rating) => {
				return total + rating
			}, 0)
			this.r.rating = Math.round((ratingSum / ratings.length) * 10) / 10 || 0
			this.ratingCount = ratings.length
		},
		refreshRating() {
			this.calculateRating()
			this.initializeRatingOverId()
		},
		toTop() {
			window.scrollTo(0, 0)
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

	template: `
	<div class="row">
		<div class="col-md-12" style="padding-top:3%; padding-left:1%;">
			<ul class="nav nav-tabs sticky-top" @click="toTop" id="nav-tab" role="tablist" :style="{top: navbarHeight + 'px', marginLeft: -1 + '%', opacity: 0.9}">
				<li class="nav-item" role="presentation">
					<button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true" @click="refreshRating">Information</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="articles-tab" data-bs-toggle="tab" data-bs-target="#articles" type="button" role="tab" aria-controls="articles" aria-selected="false">Articles</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="comments-tab" data-bs-toggle="tab" data-bs-target="#comments" type="button" role="tab" aria-controls="comments" aria-selected="false" @click="initializeRating">Comments</button>
				</li>
			</ul>
			<div v-if="restaurant" class="tab-content" id="nav-tabContent">
				<div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
					<div class="row">
						<div class="col">
							<h1 class="text-center" style="color:white;">Restaurant overview</h1>
							<div class="menu-box">
								<div class="container">
									<div class="row" style="text-align: center;">
										<div class="row justify-content-center">
											<div class="col-md-6 align-self-center special-grid drinks" >
												<img v-if="restaurant" :src="'data:image/jpeg;base64,' + restaurant.logo" class="img-fluid" alt="Image">
											</div>
											<div class="col-md-6 align-self-center">
												<h1 style="color:white;">{{restaurant.name}}</h1>
												<h5 style="color:gray;">{{restaurant.type}}</h5>
												<h5 style="color:gray;">{{restaurant.status}}</h5>
												<div v-show="r !== null" class="row">
													<div class="col align-self-center">
														<input id="restaurantRating" class="rating rating-loading" :value="r?.rating" data-min="0" data-max="5" data-step="0.1">
														<h5 style="color:gray;">{{r?.rating.toFixed(1)}} ({{ratingCount}})</h5>
													</div>
												</div>
											</div>
										</div>
										<div class="row mt-5 justify-content-center">
											<div class="col-md-12 align-self-center">
												<h3 style="color:white;">{{restaurant.location.address | addressFormat}}</h3>
											</div>
										</div>
										<div class="row justify-content-center">
											<div class="col-md-12 align-self-center">
												<h6 style="color:gray;" >{{restaurant.location | locationFormat}}</h6>
											</div>
										</div>	
										<div class="row justify-content-center">
											<div class="col justify-content-center d-flex align-self-center">
												<staticMap v-if="r"></staticMap>
											</div>
										</div>	
									</div>
								</div>
							</div>	
						</div>
					</div>
				</div>
				<div class="tab-pane fade" id="articles" role="tabpanel" aria-labelledby="articles-tab">
					<articles v-if="r" :single-restaurant="r.name" ref="articlesRef"></articles>
				</div>
				<div class="tab-pane fade" id="comments" role="tabpanel" aria-labelledby="comments-tab">
					<comments v-if="r && $root.$data.comments.length > 0" :single-restaurant="r.name"></comments>
				</div>
			</div>
		</div>
	</div>	
	`
});