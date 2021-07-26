const articleEdit = { template: `<articleEdit></articleEdit>` }

Vue.component("articles", {

	data: function () {
		return {
			articles: [],
			articleForEdit: null,
			alert: '',
			cartArticles: [],
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
					this.articles = this.articles.map(article => {
						return { ...article, amount: 0 }
					})
				})
		}

	},

	components: {
	},

	filters: {

	},

	methods: {
		updateArticle(articleDto) {
			this.articles = this.articles.map(article =>
				article.name === articleDto.oldName ? { ...articleDto.article } : article
			)
			this.alert = `Successfully edited article ${articleDto.oldName}!`
			$('#articleEditAlert').fadeIn(300).delay(5000).fadeOut(300);
		},
		incrementAmount(a){
			a.amount += 1
		},
		decrementAmount(a){
			if (a.amount > 0) a.amount -= 1 
		}
	},

	template: `
		<div class="row">
			<div class="col-md-12">
				<h1 class="text-center">Articles</h1>
				<div class="menu-box">
					<div class="container">
						<a href="#" id="back-to-top" title="Back to top" style="display: none;"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></a>
						<div class="row">
							<div v-for="a in articles" class="col-md-4">
								<div class="card text-center h-100" style="width: 20rem;">
									<articleEdit v-if="$root.user?.role === 'MANAGER' && a" :articleProp="a" :key="a.name" @article-updated="updateArticle"></articleEdit>
									<div class="card-body">
										<div class="embed-responsive embed-responsive-16by9">
											<img :src="'data:image/png;base64,' + a.image" class="card-img-top embed-responsive-item" alt="Image">
										</div>
										<h1 class="card-title">{{a.name}}</h1>
										<h5 class="card-subtitle mb-2 text-muted"><i>{{a.type}}</i></h5>
										<p class="card-text" v-if="a.description != ''">{{a.description}}</p>
										<h4 v-if="a.type === 'FOOD'">{{a.quantity}} grams</h4>
										<h4 v-else>{{a.quantity}} milliliters</h4>
									</div>
									<div class="card-footer">
										<h3>{{a.price}} RSD</h3>
										<div v-if="$root.user?.role === 'CUSTOMER' " class="row mb-3">									
											<div class="number">
												<button class="btn btn-primary btn-sm" @click="decrementAmount(a)">
													<span class="fa fa-minus"></span>
												</button>
												<input type="number" class="article-amount my-number" :value="a.amount"/>
												<button class="btn btn-primary btn-sm" @click="incrementAmount(a)">
													<span class="fa fa-plus"></span>
												</button>
											</div>
										</div>	
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="alert alert-warning fixed-bottom" style="display:none; z-index: 10000;" role="alert" id="articleEditAlert">
					<p>{{alert}}</p>
				</div>
			</div>
		</div>
	`
});