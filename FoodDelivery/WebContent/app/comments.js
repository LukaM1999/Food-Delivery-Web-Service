Vue.component("comments", {

	data: function () {
		return {
			comments: [],
		}
	},

	props: {
		singleRestaurant: {
			type: String,
		}
	},

	mounted() {
		if (this.singleRestaurant) this.getRestaurantComments()
	},

	methods: {
		getRestaurantComments() {
			if (this.$root.$data.user?.role === 'CUSTOMER' || this.$root.$data.user?.role === 'DELIVERER' 
				|| this.$root.$data.user === null || (this.$root.$data.user?.role === 'MANAGER' && this.singleRestaurant !== this.$root.user?.restaurant?.name))
				this.comments = this.$root.$data.comments.filter(c => c.approval === 'APPROVED' && c.restaurant === this.singleRestaurant)
			else
				this.comments = this.$root.$data.comments.filter(c => c.restaurant === this.singleRestaurant)

		},
		setCommentApproval(comment, approval) {
			comment.approval = approval
			this.$root.$data.comments.find(c => c.orderId === comment.orderId).approval = approval
			axios.put('rest/comment/setCommentApproval', comment)
			if (approval === 'APPROVED') {
				this.$root.showAlert('Successfully approved comment!')
				this.calculateRating()
			}
			if (approval === 'REJECTED') this.$root.showAlert('Successfully rejected comment!')
		},
		calculateRating() {
			const ratings = this.$root.$data.comments.flatMap(c => c.restaurant === this.singleRestaurant && c.approval === 'APPROVED' ? c.rating : [])
			const ratingSum = ratings.reduce((total, rating) => {
				return total + rating
			}, 0)
			const rating = Math.round((ratingSum / ratings.length) * 10) / 10
			axios.put('rest/restaurant/updateRating', { restaurant: this.singleRestaurant, rating: rating })
		},
	},

	template: `
		<div class="row" style="padding-top:15px; padding-left:15px;">
			<div class="col">
				<h1 class="text-center" style="color:white;">Comments</h1>
				<div class="menu-box">
					<div class="container">
						<div class="row">
							<div v-for="c in comments" class="col-md-4 mb-4">
								<div class="card text-center h-100 my-shadow" style="width: 20rem;">
									<i v-show="c.approval === 'APPROVED' && (($root.$data.user?.role === 'MANAGER' && singleRestaurant === $root.user?.restaurant?.name) 
										|| $root.$data.user?.role === 'ADMIN')" class="fa fa-3x fa-check position-absolute top-0 start-100 translate-middle" 
										style="z-index: 10; color:lightgreen;"></i>
									<i v-show="c.approval === 'REJECTED' && ($root.$data.user?.role === 'MANAGER' || $root.$data.user?.role === 'ADMIN')"
										class="fa fa-3x fa-times position-absolute top-0 start-100 translate-middle" style="z-index: 10; color:red;"></i>  
									<div class="card-body">
										<h3 class="card-title">{{c.poster}}</h3>
										<h5 class="card-subtitle mb-2 text-muted">{{c.date}}</h5>
										<p class="card-text">{{c.content}}</p>
										<div class="container">
											<label for="c.orderId" class="control-label">Rating</label>
                                        	<input id="c.orderId" class="rating rating-loading" :value="c.rating" data-min="0" data-max="5" data-step="1">
										</div>	
									</div>
									<div class="card-footer" v-show="c.approval === 'PROCESSING' && $root.$data.user?.role === 'MANAGER'" style="display:inline;">
										<button class="btn btn-primary" title="Approve comment" @click="setCommentApproval(c, 'APPROVED')"><i class="fa fa-2x fa-check"></i></button>
										<button class="btn btn-danger" title="Reject comment" @click="setCommentApproval(c, 'REJECTED')"><i class="fa fa-2x fa-times"></i></button>
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