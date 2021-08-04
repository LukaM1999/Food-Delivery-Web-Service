const staticMap = { template: '<staticMap></staticMap>' }
const articles = { template: '<articles></articles>' }
const comments = { template: `<comments></comments>` }

Vue.component("restaurantPage", {

	data() {
		return {
			r: null,
			comments: false
		}
	},

	mounted() {
		axios
			.post('rest/restaurant/setLocation', this.restaurant.location)
			.then(response => { this.r = this.restaurant });
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
			<nav>
				<div class="nav nav-tabs" id="nav-tab" role="tablist">
					<button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true">Information</button>
					<button class="nav-link" id="articles-tab" data-bs-toggle="tab" data-bs-target="#articles" type="button" role="tab" aria-controls="articles" aria-selected="true">Articles</button>
					<button class="nav-link" id="comments-tab" data-bs-toggle="tab" data-bs-target="#comments" type="button" role="tab" aria-controls="comments" aria-selected="false" @click="initializeRating">Comments</button>
				</div>	
			</nav>
			<div v-if="restaurant" class="tab-content" id="nav-tabContent">
				<div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
					<div class="row">
						<div class="col">
							<h1 class="text-center">Restaurant overview</h1>
							<div class="menu-box">
								<div class="container">
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
										<div class="row">
											<div class="col-md-12">
												<h2>*****</h2>
											</div>
										</div>
										<div class="row justify-content-center">
											<div class="col-md-12">
												<h3>{{restaurant.location.address | addressFormat}}</h3>
												<h6 style="color:gray;" >{{restaurant.location | locationFormat}}</h6>
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