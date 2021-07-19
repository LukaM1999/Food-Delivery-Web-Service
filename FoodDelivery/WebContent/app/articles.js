Vue.component("articles", {

	data: function () {
		return {
			articles: [],
		}
	},

	props: {
		singleRestaurant: {
			type: String,
		}
	},

	mounted() {
		console.log(this.singleRestaurant)
		if (this.singleRestaurant) {
			axios
				.get(`rest/restaurant/${this.singleRestaurant}/getArticles`)
				.then(response => {
					this.articles = response.data
				})
		}

	},

	filters: {

	},

	methods: {

	},

	template: `
		<div class="row">
			<div class="col-md-12">
				<h1>Articles</h1>
				<div class="menu-box">
					<div class="container">
						<a href="#" id="back-to-top" title="Back to top" style="display: none;"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></a>
						<div class="row inner-menu-box">
							<div class="col-20">
								<div class="tab-content" id="v-pills-tabContent">
									<div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
										<div class="row">
											<div class="col-lg-4 col-md-6 special-grid drinks" v-for="a in articles">
												<div class="gallery-single fix" style="text-align:center;" >
													<img :src="'data:image/png;base64,' + a.image" class="img-fluid" alt="Image">
													<div class="why-text">
														<h2 style="color: white;">{{a.name}}</h2>
														<h6 style="color: white;"><i>{{a.price.toFixed(2)}} RSD</i></h6>
														<h5>{{a.type}}</h5>
														<p></p>
														<h5 style="color: black;"><i>{{a.description}}</i></h5>
														<h5 v-if="a.type === 'FOOD'" style="color: black;"><i>{{a.quantity.toFixed(2)}}g</i></h5>
														<h5 v-else style="color: black;"><i>{{a.quantity.toFixed(2)}}ml</i></h5>
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