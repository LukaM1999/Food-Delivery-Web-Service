const articleEdit = { template: `<articleEdit></articleEdit>` }

Vue.component("articles", {

	data: function () {
		return {
			articles: [],
			articleForEdit: null,
		}
	},

	props: {
		singleRestaurant: {
			type: String,
		}
	},

	mounted() {
		if (this.singleRestaurant) this.getArticles()
	},

	methods: {
		async getArticles() {
			const articles = await axios.get(`rest/restaurant/${this.singleRestaurant}/getArticles`)
			this.articles = articles.data
			this.updateArticleAmount()
		},
		updateArticleAmount() {
			this.articles = this.articles.map(article => { return { ...article, amount: 0 } })
		},
		updateArticle(articleDto) {
			this.articles = this.articles.map(article =>
				article.name === articleDto.oldName ? { ...articleDto.article } : article
			)
			this.$root.showAlert(`Successfully edited article ${articleDto.oldName}!`)
		},
		incrementAmount(a) {
			a.amount += 1
			this.$root.$data.cart = {
				ownerUsername: this.$root.$data.user.username,
				articles: this.articles
			}
		},
		decrementAmount(a) {
			if (a.amount == 0) return
			a.amount -= 1
			this.$root.$data.cart = {
				ownerUsername: this.$root.$data.user.username,
				articles: this.articles
			}
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
							<div v-for="a in articles" class="col-md-4 mb-4">
								<div class="card text-center h-100" style="width: 20rem;">
									<articleEdit v-if="$root.user?.role === 'MANAGER' && a && singleRestaurant === $root.user?.restaurant?.name" 
									:articleProp="a" :key="a.name" @article-updated="updateArticle"></articleEdit>
									<div class="card-body">
										<div class="embed-responsive embed-responsive-16by9">
											<img :src="'data:image/png;base64,' + a.image" class="card-img-top embed-responsive-item" alt="Image">
										</div>
										<h1 class="card-title">{{a.name}}</h1>
										<h5 class="card-subtitle mb-2 text-muted"><i>{{a.type}}</i></h5>
										<p class="card-text" v-if="a.description != ''">{{a.description}}</p>
										<h4 v-if="a.type === 'FOOD' && a.quantity > 0">{{a.quantity}} grams</h4>
										<h4 v-else-if="a.quantity > 0">{{a.quantity}} milliliters</h4>
									</div>
									<div class="card-footer">
										<h3>{{a.price}} RSD</h3>
										<div v-if="$root.$data.user?.role === 'CUSTOMER' " class="row mb-3">									
											<div class="number">
												<button class="btn btn-primary btn-sm" @click="decrementAmount(a)">
													<span class="fa fa-minus"></span>
												</button>
												<input type="number" min="0" class="article-amount my-number" :value="a.amount"/>
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
			</div>
		</div>
	`
});